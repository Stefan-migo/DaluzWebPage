import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    const body = await request.json();
    const {
      message,
      is_internal = false,
      is_from_customer = false,
      attachments = null
    } = body;

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

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('id, customer_email, customer_name')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Get admin user details
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('email')
      .eq('id', user.id)
      .single();

    // Create the message
    const { data: newMessage, error: messageError } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        message,
        is_internal,
        is_from_customer,
        sender_id: user.id,
        sender_name: adminUser?.email || 'Admin',
        sender_email: adminUser?.email,
        attachments,
        message_type: 'message'
      })
      .select('*')
      .single();

    if (messageError) {
      console.error('Error creating support message:', messageError);
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
    }

    // If this is not an internal message, update ticket status if needed
    if (!is_internal && !is_from_customer) {
      await supabase
        .from('support_tickets')
        .update({
          status: 'pending_customer',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId)
        .eq('status', 'open'); // Only update if currently open
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'create_support_message',
      resource_type: 'support_message',
      resource_id: newMessage.id,
      details: { 
        ticket_id: ticketId,
        message_type: is_internal ? 'internal_note' : 'response'
      }
    });

    return NextResponse.json({ message: newMessage });

  } catch (error) {
    console.error('Error in create support message API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;

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

    // Get all messages for the ticket
    const { data: messages, error } = await supabase
      .from('support_messages')
      .select(`
        *,
        sender:auth.users!sender_id(
          id,
          email
        )
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching support messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });

  } catch (error) {
    console.error('Error in support messages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
