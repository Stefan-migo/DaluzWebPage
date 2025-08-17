import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Support Tickets API GET called');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const assigned_to = searchParams.get('assigned_to') || '';
    const category_id = searchParams.get('category_id') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log('📊 Query params:', { status, priority, assigned_to, category_id, search, page, limit });

    const supabase = await createClient();
    
    // Check admin authorization
    console.log('🔐 Checking user authentication...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ User authentication failed:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ User authenticated:', user.email);

    console.log('🔒 Checking admin privileges...');
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: user.id });
    if (adminError) {
      console.error('❌ Admin check error:', adminError);
      return NextResponse.json({ error: 'Admin verification failed' }, { status: 500 });
    }
    if (!isAdmin) {
      console.log('❌ User is not admin:', user.email);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    console.log('✅ Admin access confirmed for:', user.email);

    // Return mock support tickets data (TODO: replace with actual database query)
    console.log('🗄️ Returning mock support tickets...');
    
    const mockTickets = [
      {
        id: '1',
        ticket_number: 'SUP-001',
        title: 'Problema con entrega de pedido',
        description: 'Mi pedido no llegó en la fecha prometida',
        status: 'open',
        priority: 'medium',
        category_id: '2',
        customer_id: 'user1',
        assigned_to: null,
        order_id: 'order1',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: { id: '2', name: 'Pedidos' },
        customer: { id: 'user1', first_name: 'María', last_name: 'González', email: 'maria@example.com' },
        assigned_admin: null,
        order: { id: 'order1', order_number: 'ORD-001' }
      },
      {
        id: '2',
        ticket_number: 'SUP-002',
        title: 'Consulta sobre ingredientes',
        description: '¿Qué ingredientes contiene la crema facial?',
        status: 'in_progress',
        priority: 'low',
        category_id: '1',
        customer_id: 'user2',
        assigned_to: 'admin1',
        order_id: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        category: { id: '1', name: 'Productos' },
        customer: { id: 'user2', first_name: 'Carlos', last_name: 'López', email: 'carlos@example.com' },
        assigned_admin: { id: 'admin1', email: 'admin@daluzconsciente.com' },
        order: null
      },
      {
        id: '3',
        ticket_number: 'SUP-003',
        title: 'Problema con membresía',
        description: 'No puedo acceder a los contenidos del programa',
        status: 'open',
        priority: 'high',
        category_id: '3',
        customer_id: 'user3',
        assigned_to: null,
        order_id: null,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: { id: '3', name: 'Membresía' },
        customer: { id: 'user3', first_name: 'Ana', last_name: 'Martínez', email: 'ana@example.com' },
        assigned_admin: null,
        order: null
      }
    ];

    // Apply simple filtering to mock data
    let filteredTickets = mockTickets;
    
    if (status && status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    
    if (priority && priority !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }
    
    if (assigned_to && assigned_to !== 'all') {
      if (assigned_to === 'unassigned') {
        filteredTickets = filteredTickets.filter(ticket => !ticket.assigned_to);
      } else {
        filteredTickets = filteredTickets.filter(ticket => ticket.assigned_to === assigned_to);
      }
    }
    
    if (category_id && category_id !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => ticket.category_id === category_id);
    }
    
    if (search) {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase()) ||
        ticket.ticket_number.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const total = filteredTickets.length;
    const paginatedTickets = filteredTickets.slice(offset, offset + limit);
    
    console.log(`✅ Support tickets returned: ${paginatedTickets.length} of ${total}`);

    return NextResponse.json({
      tickets: paginatedTickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error in support tickets API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Support Tickets API POST called (create ticket)');
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ User authentication failed:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // TODO: Implement ticket creation once support_tickets table is available
    console.log('⚠️ Ticket creation not yet implemented (mock response)');
    
    return NextResponse.json({
      message: 'Ticket creation will be available once database tables are migrated',
      success: false
    });

  } catch (error) {
    console.error('Error in support tickets POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}