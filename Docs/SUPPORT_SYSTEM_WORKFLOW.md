# Support System Workflow Documentation
## DA LUZ CONSCIENTE - Sistema de Soporte al Cliente

**Last Updated:** November 12, 2025  
**Version:** 1.0.0

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Ticket Lifecycle](#ticket-lifecycle)
4. [Email Notifications](#email-notifications)
5. [API Endpoints](#api-endpoints)
6. [Admin Interface](#admin-interface)
7. [Best Practices](#best-practices)

---

## Overview

The support system is a comprehensive ticket management solution designed to handle customer inquiries, issues, and requests efficiently. It provides:

- **Ticket Management**: Create, track, and resolve customer support tickets
- **Message Threading**: Conversation history with internal notes support
- **Status Tracking**: Real-time ticket status updates with notifications
- **Priority Management**: Categorize tickets by urgency (low, medium, high, urgent)
- **Email Integration**: Automated notifications via Resend
- **Analytics**: Track response times, resolution rates, and ticket metrics

### Key Features

- ✅ Real-time ticket status changes
- ✅ Inline status editing in the admin table
- ✅ Automatic ticket number generation (SUP-XXX format)
- ✅ Last activity tracking
- ✅ Email notifications for all major events
- ✅ Internal notes (admin-only communication)
- ✅ Customer message threading
- ✅ Order linkage (tickets can be associated with orders)
- ✅ Category-based organization
- ✅ Assignment to admin users

---

## Database Schema

### 1. `support_categories`

Categories for organizing support tickets.

```sql
CREATE TABLE support_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Default Categories:**
- Productos (Product inquiries)
- Pedidos (Order issues)
- Membresía (Membership support)
- Técnico (Technical issues)
- General (General inquiries)

### 2. `support_tickets`

Main ticket storage with full lifecycle tracking.

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Ticket details
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES support_categories(id) ON DELETE SET NULL,
  priority support_priority DEFAULT 'medium',
  status support_status DEFAULT 'open',
  
  -- Assignment
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  
  -- Related order (if applicable)
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- Resolution
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  
  -- Tracking
  first_response_at TIMESTAMPTZ,
  last_response_at TIMESTAMPTZ,
  customer_satisfaction_rating INTEGER CHECK (customer_satisfaction_rating >= 1 AND customer_satisfaction_rating <= 5),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Priority Enum:**
- `low`: Low priority
- `medium`: Medium priority (default)
- `high`: High priority
- `urgent`: Urgent (requires immediate attention)

**Status Enum:**
- `open`: New ticket, awaiting initial response
- `in_progress`: Admin is actively working on the ticket
- `pending_customer`: Waiting for customer response
- `resolved`: Issue has been resolved
- `closed`: Ticket is closed (final state)

### 3. `support_messages`

Conversation history for support tickets.

```sql
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  
  -- Message details
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false, -- true for internal admin notes
  is_from_customer BOOLEAN DEFAULT false,
  
  -- Sender information
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT,
  sender_email TEXT,
  
  -- Attachments
  attachments JSONB, -- array of file URLs and metadata
  
  -- Message type
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'note', 'status_change', 'assignment')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

**Message Types:**
- `message`: Regular customer or admin message
- `note`: Internal admin note (not visible to customer)
- `status_change`: System-generated status change notification
- `assignment`: System-generated assignment notification

### 4. `support_templates`

Reusable templates for common responses.

```sql
CREATE TABLE support_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES support_categories(id) ON DELETE SET NULL,
  
  -- Template variables support (e.g., {{customer_name}}, {{order_number}})
  variables JSONB,
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Creator
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

---

## Ticket Lifecycle

### 1. Ticket Creation

**Trigger:** Admin creates a ticket on behalf of a customer OR customer submits a support request

**Process:**
1. Generate unique ticket number (format: `SUP-XXX`)
2. Validate required fields (subject, description, customer_email)
3. Link to existing customer profile if email matches
4. Set initial status to `open`
5. Set initial priority (default: `medium`)
6. Create system message: "Ticket created by admin"
7. Send email notification to customer
8. Log admin activity

**API Endpoint:** `POST /api/admin/support/tickets`

**Email Notification:** `sendTicketCreatedEmail()`
- Subject: "Ticket creado: [subject] (#[ticket_number])"
- Includes ticket details, number, and link to view
- Reply-to: soporte@daluzconsciente.com

### 2. Admin Response

**Trigger:** Admin sends a message to the customer

**Process:**
1. Verify ticket exists
2. Create message record with admin details
3. Update ticket:
   - `last_response_at` = now
   - `first_response_at` = now (if first response)
   - `status` = `pending_customer` (if currently open)
4. Send email notification to customer (if not internal note)
5. Log admin activity

**API Endpoint:** `POST /api/admin/support/tickets/[id]/messages`

**Email Notification:** `sendNewResponseEmail()`
- Subject: "Nueva respuesta en tu ticket #[ticket_number]"
- Includes admin's message and link to ticket
- Only sent for public messages (not internal notes)

### 3. Status Change

**Trigger:** Admin updates ticket status (can be done inline in table or via edit dialog)

**Process:**
1. Validate new status
2. Update ticket record
3. Create system message documenting the change
4. If status is `resolved` or `closed`:
   - Set `resolved_at` timestamp
   - Set `resolved_by` to current admin
5. Send email notification to customer
6. Refresh stats in real-time
7. Log admin activity

**API Endpoint:** `PUT /api/admin/support/tickets/[id]`

**Email Notification:** `sendStatusChangeEmail()`
- Subject: "Actualización de ticket #[ticket_number]: [new_status]"
- Shows before/after status comparison
- Special messaging for resolved/closed states

### 4. Internal Notes

**Trigger:** Admin adds an internal note

**Process:**
1. Create message with `is_internal = true`
2. Update ticket's `updated_at` timestamp
3. **No email sent** (internal notes are admin-only)
4. Display with special "lock" icon in UI
5. Log admin activity

**UI Indicators:**
- Yellow background color
- Lock icon badge
- "Nota interna" label
- Only visible to admins

### 5. Assignment

**Trigger:** Admin assigns ticket to themselves or another admin

**Process:**
1. Update ticket `assigned_to` field
2. Set `assigned_at` timestamp
3. Create system message documenting assignment
4. **No email sent** to customer (internal change)
5. Log admin activity

### 6. Ticket Resolution

**Trigger:** Admin marks ticket as `resolved` or `closed`

**Process:**
1. Admin updates status to `resolved` or `closed`
2. Admin provides resolution text (recommended)
3. Set `resolved_at` and `resolved_by`
4. Send email notification to customer
5. Optionally request customer satisfaction rating
6. Log admin activity

**Best Practice:** Always provide a resolution description before closing a ticket.

---

## Email Notifications

All email notifications are sent via **Resend** using branded HTML templates.

### Template Structure

Each email includes:
- **Header**: DA LUZ CONSCIENTE branding with gradient
- **Content**: Ticket details and relevant information
- **CTA Button**: Link to view ticket (opens to ticket detail page)
- **Footer**: Contact information and copyright

### Email Types

#### 1. Ticket Created (`sendTicketCreatedEmail`)

**Sent when:** New ticket is created

**Recipients:** Customer

**Content:**
- Welcome message
- Ticket number and details
- Priority and status
- Important note about replying to email
- Link to view ticket

**Subject:** `Ticket creado: [subject] (#[ticket_number])`

#### 2. New Response (`sendNewResponseEmail`)

**Sent when:** Admin sends a public message (not internal note)

**Recipients:** Customer

**Content:**
- Ticket reference
- Admin's response message
- Link to view full conversation

**Subject:** `Nueva respuesta en tu ticket #[ticket_number]`

**Note:** NOT sent for internal notes

#### 3. Status Change (`sendStatusChangeEmail`)

**Sent when:** Ticket status is updated

**Recipients:** Customer

**Content:**
- Visual before/after comparison
- New status explanation
- Special messaging for resolved/closed states
- Link to ticket

**Subject:** `Actualización de ticket #[ticket_number]: [new_status]`

**Special Cases:**
- `resolved`: Green success message, encourages customer to reopen if needed
- `closed`: Informs customer ticket is closed, suggests creating new ticket if needed

### Email Configuration

**From:** `noreply@daluzconsciente.com` (configured in `RESEND_FROM_EMAIL`)

**Reply-To:** `soporte@daluzconsciente.com`

**Domain:** Configured via `NEXT_PUBLIC_APP_URL`

### Error Handling

All email sending is wrapped in try-catch blocks. If email fails:
- Error is logged to console
- Request continues successfully (email failure doesn't break core functionality)
- Admin should monitor email logs for delivery issues

---

## API Endpoints

### 1. List Tickets

**GET** `/api/admin/support/tickets`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `status`: Filter by status (open, in_progress, pending_customer, resolved, closed, all)
- `priority`: Filter by priority (low, medium, high, urgent, all)
- `category_id`: Filter by category UUID
- `assigned_to`: Filter by assignment (UUID, "unassigned", "assigned", "all")
- `search`: Search in ticket number, subject, description (client-side)

**Response:**
```json
{
  "tickets": [
    {
      "id": "uuid",
      "ticket_number": "SUP-001",
      "subject": "...",
      "status": "open",
      "priority": "medium",
      "customer": {...},
      "category": {...},
      "assigned_admin": {...},
      "order": {...},
      "last_response_at": "timestamp",
      "stats": {
        "messageCount": 5,
        "customerMessageCount": 3,
        "adminMessageCount": 2,
        "ageHours": 24,
        "needsResponse": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Features:**
- Real database queries (no mock data)
- Includes message stats for each ticket
- Calculates "needs response" flag
- Proper pagination with count

### 2. Create Ticket

**POST** `/api/admin/support/tickets`

**Body:**
```json
{
  "title": "Subject line",
  "description": "Detailed description",
  "priority": "medium",
  "category_id": "uuid",
  "customer_email": "customer@example.com",
  "customer_name": "Customer Name",
  "order_id": "uuid (optional)",
  "assigned_to": "admin_uuid (optional)",
  "created_by_admin": true
}
```

**Response:**
```json
{
  "ticket": {...},
  "success": true
}
```

**Process:**
1. Generates unique ticket number
2. Links to existing customer if found
3. Creates initial system message
4. Sends email notification
5. Logs admin activity

### 3. Get Ticket Details

**GET** `/api/admin/support/tickets/[id]`

**Response:**
```json
{
  "ticket": {
    "id": "uuid",
    "ticket_number": "SUP-001",
    "subject": "...",
    "description": "...",
    "status": "open",
    "priority": "medium",
    "customer": {...},
    "category": {...},
    "assigned_admin": {...},
    "order": {...},
    "messages": [...],
    "analytics": {
      "ageHours": 24,
      "responseTimeHours": 2,
      "messageCount": 5,
      "customerMessageCount": 3,
      "adminMessageCount": 2,
      "internalNoteCount": 1,
      "needsResponse": true,
      "lastCustomerMessageAt": "timestamp",
      "lastAdminMessageAt": "timestamp"
    }
  }
}
```

**Features:**
- Full ticket details with relationships
- Complete message thread
- Real-time analytics
- Needs response indicator

### 4. Update Ticket

**PUT** `/api/admin/support/tickets/[id]`

**Body:**
```json
{
  "status": "in_progress",
  "priority": "high",
  "assigned_to": "admin_uuid",
  "category_id": "uuid",
  "resolution": "Issue resolved by...",
  "previous_status": "open",
  "previous_assigned_to": null
}
```

**Response:**
```json
{
  "ticket": {...}
}
```

**Process:**
1. Updates ticket fields
2. Sets timestamps (resolved_at, assigned_at)
3. Creates system messages for status/assignment changes
4. Sends email if status changed
5. Logs admin activity

### 5. Send Message

**POST** `/api/admin/support/tickets/[id]/messages`

**Body:**
```json
{
  "message": "Message text",
  "is_internal": false,
  "is_from_customer": false,
  "attachments": null
}
```

**Response:**
```json
{
  "message": {
    "id": "uuid",
    "ticket_id": "uuid",
    "message": "...",
    "is_internal": false,
    "is_from_customer": false,
    "sender_email": "admin@example.com",
    "created_at": "timestamp"
  }
}
```

**Process:**
1. Creates message record
2. Updates ticket last_response_at
3. Sets first_response_at if first admin message
4. Changes status to pending_customer if public message
5. Sends email if public message (not internal note)
6. Logs admin activity

### 6. Get Categories

**GET** `/api/admin/support/categories`

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Productos",
      "description": "...",
      "is_active": true,
      "sort_order": 0
    }
  ]
}
```

---

## Admin Interface

### Main Support Page (`/admin/support`)

**Features:**

1. **Stats Cards** (6 cards at top):
   - Total Tickets
   - Open Tickets (red)
   - In Progress (yellow)
   - Urgent Tickets (red)
   - Average Response Time (hours)
   - Tickets This Week

2. **Filters**:
   - Search bar (searches ticket number, subject, email, customer name)
   - Status filter dropdown
   - Priority filter dropdown
   - Category filter dropdown
   - Assignment filter dropdown

3. **Tickets Table**:
   - **Ticket**: Number, subject, time ago
   - **Cliente**: Name, email, linked order
   - **Categoría**: Badge with category name
   - **Estado**: **Inline editable dropdown** with status badge
   - **Prioridad**: Badge with color coding
   - **Asignado**: Admin email or "Sin asignar"
   - **Última Actividad**: Time ago, "needs response" indicator, message count
   - **Acciones**: View button

4. **Inline Status Editing**:
   - Click status dropdown to change status
   - Updates immediately
   - Shows "Actualizando..." while saving
   - Auto-refreshes stats
   - Sends email notification to customer

5. **Pagination**:
   - Shows current page and total pages
   - Previous/Next buttons

### Ticket Detail Page (`/admin/support/tickets/[id]`)

**Layout:** 2-column (main content + sidebar)

**Main Content:**

1. **Ticket Details Card**:
   - Subject as title
   - Description in styled box
   - Resolution (if resolved)

2. **Conversation Card**:
   - All messages in chronological order
   - Visual distinction:
     - Customer messages: Blue background, left-aligned
     - Admin messages: Green background, right-aligned
     - Internal notes: Yellow background, lock icon
   - Sender name and timestamp
   - "Needs response" badge at top

3. **Reply Form**:
   - Checkbox: "Nota interna" (for internal notes)
   - Textarea for message
   - Visual indicator of visibility
   - Send/Add Note button

**Sidebar:**

1. **Customer Info Card**:
   - Name
   - Email
   - Phone (if available)
   - Membership badge (if member)
   - Linked order button (if applicable)

2. **Metrics Card**:
   - Age of ticket (hours)
   - Response time (hours)
   - Total messages
   - Customer messages
   - Admin responses
   - Internal notes
   - Needs response indicator

3. **Ticket Details Card**:
   - Category
   - Assigned admin
   - Created date/time
   - Last updated
   - First response time
   - Resolved date/time (if resolved)
   - Customer satisfaction rating (if rated)

**Edit Dialog**:
- Status dropdown
- Priority dropdown
- Category dropdown
- Assigned to dropdown
- Resolution textarea (if resolving)
- Cancel/Update buttons

### New Ticket Page (`/admin/support/tickets/new`)

**Layout:** 2-column (main form + sidebar)

**Main Form:**

1. **Ticket Details Card**:
   - Title (required)
   - Description (required, textarea)
   - Priority dropdown
   - Category dropdown
   - Assign to dropdown

**Sidebar:**

1. **Customer Selection Card**:
   - Search input (searches existing customers)
   - Dropdown results with customer details
   - Email input (required)
   - Name input (optional)
   - Selected customer info display

2. **Order Selection Card** (Optional):
   - Search input (searches existing orders)
   - Dropdown results with order details
   - Selected order info display

3. **Actions Card**:
   - Create Ticket button (primary)
   - Cancel button
   - Important note about email notification

---

## Best Practices

### For Admins

1. **Response Time**:
   - Aim to respond to all tickets within 24 hours
   - Prioritize urgent and high-priority tickets
   - Use "needs response" indicator to identify tickets requiring attention

2. **Status Management**:
   - Keep statuses up-to-date for accurate tracking
   - Use `in_progress` when actively working on a ticket
   - Use `pending_customer` after responding to customer
   - Always provide resolution before closing tickets

3. **Internal Notes**:
   - Use internal notes for:
     - Admin-to-admin communication
     - Investigation notes
     - Technical details
     - Escalation notes
   - Keep customer-facing messages clear and simple

4. **Assignment**:
   - Assign tickets to specialized team members when appropriate
   - Reassign if you cannot resolve the issue
   - Update assignment when escalating

5. **Communication**:
   - Be professional and empathetic
   - Provide clear, actionable responses
   - Set expectations for resolution time
   - Follow up on pending customer responses

### For System Administrators

1. **Email Configuration**:
   - Ensure `RESEND_API_KEY` is properly set
   - Verify domain authentication in Resend
   - Monitor email delivery logs
   - Set up SPF, DKIM, and DMARC records

2. **Performance**:
   - Monitor ticket volume
   - Watch for slow queries in ticket listing
   - Consider adding indexes for heavy filters
   - Archive old closed tickets if volume is high

3. **Security**:
   - Ensure RLS policies are properly configured
   - Limit admin access to authorized users only
   - Regularly audit admin activity logs
   - Protect customer data (GDPR compliance)

4. **Maintenance**:
   - Regularly review and update categories
   - Create and maintain response templates
   - Archive closed tickets older than 1 year
   - Monitor and clean up orphaned messages

5. **Metrics**:
   - Track average response time
   - Monitor ticket resolution rate
   - Identify common issues for FAQ/documentation
   - Review customer satisfaction ratings

---

## Troubleshooting

### Email Not Sending

**Possible Causes:**
1. `RESEND_API_KEY` not configured
2. Domain not verified in Resend
3. Invalid recipient email
4. Rate limiting

**Solutions:**
1. Check environment variables
2. Verify domain in Resend dashboard
3. Check error logs for specific failure reason
4. Implement retry logic if needed

### Ticket Numbers Not Generating

**Possible Cause:** Concurrent ticket creation

**Solution:** The system handles this automatically, but if issues persist:
1. Check for database conflicts
2. Verify unique constraint on `ticket_number`
3. Review ticket creation logs

### Status Not Updating

**Possible Causes:**
1. Permission issues
2. Database connection problem
3. RLS policy blocking update

**Solutions:**
1. Verify admin has proper permissions
2. Check database connection
3. Review RLS policies on `support_tickets` table

### Last Activity Not Showing

**Possible Cause:** No messages yet

**Solution:** `last_response_at` is calculated from messages. If no messages exist, it falls back to `updated_at`.

---

## Future Enhancements

Potential features to consider:

1. **Customer Portal**:
   - Allow customers to view their tickets
   - Enable customers to reply via web interface
   - Self-service ticket creation

2. **Advanced Search**:
   - Full-text search across tickets
   - Advanced filtering (date ranges, multiple statuses)
   - Saved search queries

3. **Automation**:
   - Auto-close resolved tickets after X days
   - Auto-assign based on category
   - Canned responses/templates
   - Auto-response for common issues

4. **Analytics Dashboard**:
   - Detailed performance metrics
   - Admin leaderboard
   - Category analysis
   - Customer satisfaction trends

5. **Integrations**:
   - Slack notifications for urgent tickets
   - WhatsApp integration
   - Live chat integration
   - CRM integration

6. **File Attachments**:
   - Allow customers to upload images
   - Support screenshots in messages
   - Store in Supabase Storage

7. **SLA Management**:
   - Define SLAs by priority
   - Track SLA compliance
   - Escalate overdue tickets

8. **Knowledge Base**:
   - Link tickets to KB articles
   - Suggest articles based on ticket content
   - Track article effectiveness

---

## Conclusion

The support system provides a robust, full-featured ticket management solution with:
- ✅ Real database integration
- ✅ Complete email notification system
- ✅ Inline status editing
- ✅ Last activity tracking
- ✅ Internal note support
- ✅ Comprehensive admin interface

All components are production-ready and follow best practices for security, performance, and user experience.

---

**For questions or support:**  
Contact: dev@daluzconsciente.com  
Documentation: `/Docs/SUPPORT_SYSTEM_WORKFLOW.md`

---

© 2025 DA LUZ CONSCIENTE. All rights reserved.

