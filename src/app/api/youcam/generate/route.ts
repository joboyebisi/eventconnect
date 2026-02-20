import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { file_id } = await req.json();

        if (!file_id) {
            return NextResponse.json({ error: "No file_id provided" }, { status: 400 });
        }

        const apiKey = process.env.YOUCAM_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "No YOUCAM_API_KEY provided" }, { status: 500 });
        }

        // Fetch template ID dynamically 
        let templateId = "professional_001";
        try {
            const templatesRes = await fetch("https://yce-api-01.makeupar.com/s2s/v2.0/task/template/headshot?page_size=1", {
                headers: { "Authorization": `Bearer ${apiKey}` }
            });
            if (templatesRes.ok) {
                const templatesData = await templatesRes.json();
                templateId = templatesData?.data?.templates?.[0]?.template_id || templateId;
            }
        } catch (e) { console.error("Could not fetch templates", e); }

        const generateRes = await fetch("https://yce-api-01.makeupar.com/s2s/v2.0/task/headshot", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                src_file_id: file_id,
                template_id: templateId,
                output_count: 1
            })
        });

        const generateData = await generateRes.json();

        if (!generateRes.ok) {
            return NextResponse.json({ error: "Failed to start generation", details: generateData }, { status: 500 });
        }

        return NextResponse.json({ success: true, task_id: generateData.data.task_id });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
