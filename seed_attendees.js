require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MOCK_ATTENDEES = [
    {
        name: "Alex Rivera",
        role: "Senior Frontend Engineer",
        company: "Vercel",
        linkedin: "https://linkedin.com/in/alexrivera",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80"
    },
    {
        name: "Sarah Chen",
        role: "Head of Product",
        company: "Stripe",
        linkedin: "https://linkedin.com/in/sarahchen",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80"
    },
    {
        name: "Michael Chang",
        role: "DevRel Manager",
        company: "Supabase",
        linkedin: "https://linkedin.com/in/michaelchang",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80"
    },
    {
        name: "Elena Rodriguez",
        role: "Founder & CEO",
        company: "TechNova",
        linkedin: "https://linkedin.com/in/erodriguez",
        imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&fit=crop&q=80"
    },
    {
        name: "David Kim",
        role: "Staff Software Engineer",
        company: "Google",
        linkedin: "https://linkedin.com/in/davidkim",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop&q=80"
    },
    {
        name: "Jessica Taylor",
        role: "UX Designer",
        company: "Figma",
        linkedin: "https://linkedin.com/in/jtaylor",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&fit=crop&q=80"
    }
];

async function seed() {
    console.log("Fetching DEVELOPERWEEK event...");
    // 1. Get DeveloperWeek event
    const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('id')
        .eq('slug', 'developerweek')
        .single();

    if (eventErr || !event) {
        console.error("Error fetching event, creating one...", eventErr);
        // Create it if it doesn't exist
        const { data: newEvent, error: createErr } = await supabase
            .from('events')
            .insert({
                slug: 'developerweek',
                title: 'DeveloperWeek 2026',
                date: 'October 15-17, 2026',
                location: 'Oakland Convention Center',
                image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&fit=crop&q=80',
                aboutText: 'The largest developer conference and event series.'
            })
            .select()
            .single();

        if (createErr) {
            console.error("Failed to create event:", createErr);
            process.exit(1);
        }
        event.id = newEvent.id;
    }

    console.log(`Event ID: ${event.id}`);

    // 2. Clear existing mock attendees to avoid duplicates
    console.log("Deleting existing attendees...");
    await supabase.from('attendee_profiles').delete().eq('eventId', event.id);

    // 3. Insert new mocked attendees
    console.log("Inserting mock attendees...");
    const attendeesWithEventId = MOCK_ATTENDEES.map(a => ({ ...a, eventId: event.id }));
    const { error: insertErr } = await supabase
        .from('attendee_profiles')
        .insert(attendeesWithEventId);

    if (insertErr) {
        console.error("Failed to insert attendees:", insertErr);
    } else {
        console.log("Successfully seeded mock attendees!");
    }
}

seed();
