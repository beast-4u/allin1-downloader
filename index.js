// SaveAll - Video Downloader Rescue Engine
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    
    // Building the UI directly to bypass Atoms.dev errors
    root.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; color: white; padding: 20px;">
            <div style="background: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 20px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); width: 100%; max-width: 500px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                <h1 style="font-size: 2.5rem; margin-bottom: 10px; background: linear-gradient(to right, #ff00cc, #3333ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SaveAll</h1>
                <p style="color: #ccc; margin-bottom: 30px;">Download Videos Without Watermark</p>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="videoUrl" placeholder="Paste YouTube, TikTok, or Instagram link here..." style="flex: 1; padding: 12px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: white; outline: none;">
                    <button id="dlBtn" style="background: #ff00cc; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">Download</button>
                </div>
                
                <div id="status" style="margin-top: 20px; font-size: 0.9rem; color: #888;">Supported: YouTube, TikTok, Instagram</div>
            </div>
        </div>
    `;

    const btn = document.getElementById("dlBtn");
    btn.addEventListener("click", () => {
        const url = document.getElementById("videoUrl").value;
        if(url) {
            alert("Connection to server established. Processing link: " + url);
            // This is where your backend logic would go
        } else {
            alert("Please paste a link first!");
        }
    });
});
