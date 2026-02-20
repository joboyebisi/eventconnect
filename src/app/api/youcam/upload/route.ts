import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const apiKey = process.env.YOUCAM_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "No YOUCAM_API_KEY found" }, { status: 500 });
        }

        // 1. Get upload URL
        const getUrlRes = await fetch("https://yce-api-01.makeupar.com/s2s/v2.0/file/headshot", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                files: [{
                    file_name: file.name,
                    file_size: file.size,
                    content_type: file.type
                }]
            })
        });

        if (!getUrlRes.ok) {
            const errData = await getUrlRes.text();
            console.error("YouCam API Failed:", errData);
            return NextResponse.json({ error: "Failed to get upload URL from YouCam" }, { status: 500 });
        }

        const getUrlData = await getUrlRes.json();
        const fileInfo = getUrlData.data.files[0];
        const uploadUrl = fileInfo.upload_url;
        const fileId = fileInfo.file_id;

        // 2. Upload file bytes
        const fileBuffer = await file.arrayBuffer();
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
                "Content-Length": file.size.toString()
            },
            body: fileBuffer
        });

        if (!uploadRes.ok) {
            const uploadErr = await uploadRes.text();
            console.error("YouCam Upload Failed:", uploadErr);
            return NextResponse.json({ error: "Failed to upload file bytes to YouCam storage" }, { status: 500 });
        }

        return NextResponse.json({ success: true, file_id: fileId });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
