import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const mode = formData.get('mode') as string || 'create'; // 'create', 'update', 'upsert'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Read and parse CSV file
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must contain headers and at least one data row' }, { status: 400 });
    }

    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Define expected columns and their mappings
    const columnMappings: Record<string, string> = {
      'nombre': 'name',
      'name': 'name',
      'slug': 'slug',
      'descripcion': 'description',
      'description': 'description',
      'precio': 'price',
      'price': 'price',
      'precio_comparacion': 'compare_at_price',
      'compare_at_price': 'compare_at_price',
      'stock': 'inventory_quantity',
      'inventory_quantity': 'inventory_quantity',
      'estado': 'status',
      'status': 'status',
      'destacado': 'is_featured',
      'is_featured': 'is_featured',
      'sku': 'sku',
      'peso': 'weight',
      'weight': 'weight',
      'tipos_piel': 'skin_type',
      'skin_type': 'skin_type',
      'beneficios': 'benefits',
      'benefits': 'benefits',
      'certificaciones': 'certifications',
      'certifications': 'certifications',
      'instrucciones': 'usage_instructions',
      'usage_instructions': 'usage_instructions',
      'categoria': 'category_name',
      'category': 'category_name'
    };

    // Get categories for mapping
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug');

    const categoryMap = categories?.reduce((acc: any, cat) => {
      acc[cat.name.toLowerCase()] = cat.id;
      acc[cat.slug.toLowerCase()] = cat.id;
      return acc;
    }, {}) || {};

    // Parse data rows
    const products = [];
    const errors = [];
    const warnings = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) {
          errors.push(`Línea ${i + 1}: Número de columnas incorrecto`);
          continue;
        }

        const rowData: any = {};
        headers.forEach((header, index) => {
          const mappedField = columnMappings[header.toLowerCase()];
          if (mappedField) {
            rowData[mappedField] = values[index];
          }
        });

        // Process and validate product data
        const product: any = {
          name: rowData.name?.trim(),
          slug: rowData.slug?.trim() || generateSlug(rowData.name || ''),
          description: rowData.description?.trim(),
          price: parseFloat(rowData.price) || 0,
          compare_at_price: rowData.compare_at_price ? parseFloat(rowData.compare_at_price) : null,
          inventory_quantity: parseInt(rowData.inventory_quantity) || 0,
          status: rowData.status?.toLowerCase() || 'draft',
          is_featured: parseBoolean(rowData.is_featured),
          sku: rowData.sku?.trim(),
          weight: rowData.weight ? parseFloat(rowData.weight) : null,
          skin_type: parseArray(rowData.skin_type),
          benefits: parseArray(rowData.benefits),
          certifications: parseArray(rowData.certifications),
          usage_instructions: rowData.usage_instructions?.trim(),
          track_inventory: true,
          vendor: 'ALKIMYA DA LUZ',
          currency: 'ARS'
        };

        // Handle category
        if (rowData.category_name) {
          const categoryId = categoryMap[rowData.category_name.toLowerCase()];
          if (categoryId) {
            product.category_id = categoryId;
          } else {
            warnings.push(`Línea ${i + 1}: Categoría '${rowData.category_name}' no encontrada`);
          }
        }

        // Validation
        if (!product.name) {
          errors.push(`Línea ${i + 1}: Nombre es requerido`);
          continue;
        }

        if (product.price < 0) {
          errors.push(`Línea ${i + 1}: Precio no puede ser negativo`);
          continue;
        }

        if (!['draft', 'active', 'archived'].includes(product.status)) {
          warnings.push(`Línea ${i + 1}: Estado '${product.status}' inválido, usando 'draft'`);
          product.status = 'draft';
        }

        products.push({
          ...product,
          line_number: i + 1,
          original_data: rowData
        });

      } catch (error) {
        errors.push(`Línea ${i + 1}: Error de formato - ${error}`);
      }
    }

    if (errors.length > 0 && products.length === 0) {
      return NextResponse.json({ 
        error: 'No se pudieron procesar los productos',
        errors,
        warnings
      }, { status: 400 });
    }

    // Process products based on mode
    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [...errors],
      warnings: [...warnings],
      details: [] as any[]
    };

    for (const product of products) {
      try {
        if (mode === 'create') {
          // Always create new products
          const { data, error } = await supabase
            .from('products')
            .insert({
              ...product,
              line_number: undefined,
              original_data: undefined,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select('id, name, slug')
            .single();

          if (error) {
            if (error.code === '23505') { // Unique constraint violation
              results.errors.push(`Línea ${product.line_number}: Producto con slug '${product.slug}' ya existe`);
              results.skipped++;
            } else {
              results.errors.push(`Línea ${product.line_number}: ${error.message}`);
              results.skipped++;
            }
          } else {
            results.created++;
            results.details.push({ action: 'created', product: data });
          }

        } else if (mode === 'update') {
          // Update existing products by SKU or slug
          const identifier = product.sku || product.slug;
          const { data: existing } = await supabase
            .from('products')
            .select('id')
            .or(`sku.eq.${identifier},slug.eq.${identifier}`)
            .single();

          if (existing) {
            const { data, error } = await supabase
              .from('products')
              .update({
                ...product,
                line_number: undefined,
                original_data: undefined,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)
              .select('id, name, slug')
              .single();

            if (error) {
              results.errors.push(`Línea ${product.line_number}: ${error.message}`);
              results.skipped++;
            } else {
              results.updated++;
              results.details.push({ action: 'updated', product: data });
            }
          } else {
            results.warnings.push(`Línea ${product.line_number}: Producto no encontrado para actualizar`);
            results.skipped++;
          }

        } else if (mode === 'upsert') {
          // Update if exists, create if not
          const identifier = product.sku || product.slug;
          const { data: existing } = await supabase
            .from('products')
            .select('id')
            .or(`sku.eq.${identifier},slug.eq.${identifier}`)
            .single();

          if (existing) {
            // Update existing
            const { data, error } = await supabase
              .from('products')
              .update({
                ...product,
                line_number: undefined,
                original_data: undefined,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id)
              .select('id, name, slug')
              .single();

            if (error) {
              results.errors.push(`Línea ${product.line_number}: ${error.message}`);
              results.skipped++;
            } else {
              results.updated++;
              results.details.push({ action: 'updated', product: data });
            }
          } else {
            // Create new
            const { data, error } = await supabase
              .from('products')
              .insert({
                ...product,
                line_number: undefined,
                original_data: undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select('id, name, slug')
              .single();

            if (error) {
              results.errors.push(`Línea ${product.line_number}: ${error.message}`);
              results.skipped++;
            } else {
              results.created++;
              results.details.push({ action: 'created', product: data });
            }
          }
        }

      } catch (error) {
        results.errors.push(`Línea ${product.line_number}: Error inesperado - ${error}`);
        results.skipped++;
      }
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'import_products',
      resource_type: 'product',
      resource_id: 'bulk_import',
      details: { 
        mode,
        total_rows: products.length,
        created: results.created,
        updated: results.updated,
        skipped: results.skipped,
        errors_count: results.errors.length
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        total_processed: products.length,
        created: results.created,
        updated: results.updated,
        skipped: results.skipped,
        errors_count: results.errors.length,
        warnings_count: results.warnings.length
      },
      results
    });

  } catch (error) {
    console.error('Error in import products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseBoolean(value: string): boolean {
  if (!value) return false;
  const lowerValue = value.toLowerCase().trim();
  return ['true', '1', 'yes', 'sí', 'si', 'y'].includes(lowerValue);
}

function parseArray(value: string): string[] {
  if (!value) return [];
  return value.split(';').map(item => item.trim()).filter(item => item.length > 0);
}
