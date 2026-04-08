import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    // Check admin authorization
    
    

    const { data: template, error } = await supabase
      .from('system_email_templates')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch email template' 
      }, { status: 500 });
    }

    if (!template) {
      return NextResponse.json({ 
        error: 'Template not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ template });

  } catch (error) {
    console.error('Error in email template API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      subject,
      content,
      is_active,
      variables
    } = body;

    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    // Check admin authorization
    
    

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (subject !== undefined) updateData.subject = subject;
    if (content !== undefined) updateData.content = content;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (variables !== undefined) updateData.variables = Array.isArray(variables) ? variables : JSON.parse(variables || '[]');

    const { data: template, error } = await supabase
      .from('system_email_templates')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email template:', error);
      return NextResponse.json({ 
        error: 'Failed to update email template',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      template 
    });

  } catch (error) {
    console.error('Error in update email template API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    // Check admin authorization
    
    

    const { error } = await supabase
      .from('system_email_templates')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting email template:', error);
      return NextResponse.json({ 
        error: 'Failed to delete email template' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Template deleted successfully' 
    });

  } catch (error) {
    console.error('Error in delete email template API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

