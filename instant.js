// Inner photo 352x362 (360x360 px image)

class InstantPhoto extends HTMLElement {
    static get observedAttributes() {
        return ["src", "caption", "pinned", "wip", "data-tags"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "block";
        wrapper.style.fontSize = "0";

        this.canvas = document.createElement("canvas");
        wrapper.appendChild(this.canvas);

        this.shadowRoot.appendChild(wrapper);

        this.ctx = this.canvas.getContext("2d");
        this.photo = new Image();
        this.frameImg = new Image();

        // Always use the same frame
        this.frameImg.src = "Frame.png";

        // Create new tag images
        this.wipBanner = new Image();
        this.tagWeb = new Image();
        this.tagMobile = new Image();
        this.tagGame = new Image();
        this.tag3D = new Image();
        this.tagHard = new Image();
        this.tagOther = new Image();

        // Set src images for tags
        this.wipBanner.src = "static/Tag-InProgress.webp";
        this.tagWeb.src = "static/Tag-Web.webp";
        this.tagMobile.src = "static/Tag-Mobile.webp";
        this.tagGame.src = "static/Tag-Game.webp";
        this.tag3D.src = "static/Tag-3DModeling.webp";
        this.tagHard.src = "static/Tag-Electronics.webp";
        this.tagOther.src = "static/Tag-Other.webp";

        this.photo.onload = () => this.draw();
        this.frameImg.onload = () => this.draw();

        // draw tags onload
        this.wipBanner.onload = () => this.draw();
        this.tagWeb.onload = () => this.draw();
        this.tagMobile.onload = () => this.draw();
        this.tagGame.onload = () => this.draw();
        this.tag3D.onload = () => this.draw();
        this.tagHard.onload = () => this.draw();
        this.tagOther.onload = () => this.draw();

        // Load custom font
        const font = new FontFace("FreshPalm", "url(FreshPalm.otf)");
        font.load().then(loadedFont => {
            document.fonts.add(loadedFont);
            this.draw();
        }).catch(err => console.error("Font failed to load:", err));
    }

    connectedCallback() {
        if (this.getAttribute("src")) {
            this.photo.src = this.getAttribute("src");
        }
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        if (name === "src") this.photo.src = newVal;
        if (name === "caption" || name === "pinned" || name === "wip" || name === "data-tags") this.draw();
    }

    draw() {
        if (!this.photo.complete || !this.frameImg.complete) return;

        // Match canvas to frame size
        this.canvas.width = this.frameImg.width;
        this.canvas.height = this.frameImg.height;

        const aspectRatio = this.photo.width / this.photo.height;
        let newWidth, newHeight, xPos, yPos;

        const widthDiff = Math.abs(this.photo.width - this.photo.height);
        if (widthDiff <= 50) { // Square-ish
            newWidth = 352;
            newHeight = 362;
            xPos = (this.canvas.width - newWidth) / 2;
            yPos = 29;
        }
        else if (this.photo.height >= this.photo.width) { // Portrait
            newWidth = 352;
            newHeight = newWidth / aspectRatio;
            yPos = (this.canvas.height - newHeight) / 2;
            xPos = (this.canvas.width - newWidth) / 2;
        }
        else { // Landscape
            newHeight = 362;
            newWidth = newHeight * aspectRatio;
            yPos = 29;
            xPos = (this.canvas.width - newWidth) / 2;
        }

        // Draw photo
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.photo, xPos, yPos, newWidth, newHeight);

        // Draw frame
        this.ctx.drawImage(this.frameImg, 0, 0);

        // --- Draw pin only if pinned attribute is present ---
        if (this.hasAttribute("pinned")) {
            const pinColors = ["#ff66b2", "#ffc400", "#26c7d5", "#a448da"];
            const pinColor = pinColors[Math.floor(Math.random() * pinColors.length)];

            const randOffsetX = (Math.random() - 0.5) * 12; // ±6px horizontal
            const randOffsetY = (Math.random() - 0.5) * 6;  // ±3px vertical

            const pinX = (this.canvas.width / 2) + randOffsetX;
            const pinY = 14 + randOffsetY;
            const pinRadius = 8;

            // Shadow under pin
            this.ctx.beginPath();
            this.ctx.arc(pinX + 2, pinY + 2, pinRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.fill();

            // Pin base color
            this.ctx.beginPath();
            this.ctx.arc(pinX, pinY, pinRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = pinColor;
            this.ctx.fill();

            // Inner shadow
            const grad = this.ctx.createRadialGradient(
                pinX + 3, pinY + 3, pinRadius / 4,
                pinX + 3, pinY + 3, pinRadius
            );
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255,0.2)");

            this.ctx.beginPath();
            this.ctx.arc(pinX, pinY, pinRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = grad;
            this.ctx.fill();

            // Highlight
            this.ctx.beginPath();
            this.ctx.arc(pinX - 3, pinY - 3, pinRadius / 3, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgba(255,255,255,0.5)";
            this.ctx.fill();
        }

        // Draw tags
        if (this.hasAttribute("data-tags")) {
            if (this.getAttribute("data-tags").toString().includes("WEB")) {
                this.ctx.drawImage(this.tagWeb, 0, 0);
            }
            if (this.getAttribute("data-tags").toString().includes("MOBILE")) {
                this.ctx.drawImage(this.tagMobile, 0, 0);
            }
            if (this.getAttribute("data-tags").toString().includes("GAME")) {
                this.ctx.drawImage(this.tagGame, 0, 0);
            }
            if (this.getAttribute("data-tags").toString().includes("3D")) {
                this.ctx.drawImage(this.tag3D, 0, 0);
            }
            if (this.getAttribute("data-tags").toString().includes("HARD")) {
                this.ctx.drawImage(this.tagHard, 0, 0);
            }
            if (this.getAttribute("data-tags").toString().includes("OTHER")) {
                this.ctx.drawImage(this.tagOther, 0, 0);
            }
        }

        // --- Draw WIP banner ---
        if (this.hasAttribute("wip")) {
            this.ctx.drawImage(this.wipBanner, 0, 0);
        }

        // --- Caption ---
        const caption = this.getAttribute("caption");
        if (caption) {
            this.ctx.font = "43px FreshPalm";
            this.ctx.fillStyle = "#191919";
            this.ctx.textAlign = "center";
            this.ctx.fillText(caption, this.canvas.width / 2, this.canvas.height - 37);
        }
    }
}

customElements.define("instant-photo", InstantPhoto);
