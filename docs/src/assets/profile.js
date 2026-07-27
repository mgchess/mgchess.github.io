/* test
const profile = {
    picture: "txt-prof",
    color: "#ff00ea",
    border: 'gradient;["top","red","blue"]'
};
sessionStorage.setItem("profile-picture", JSON.stringify(profile));
*/

// string
export function loadProfile(html, id, pre = "") {
    const profilePicData = JSON.parse(
        sessionStorage.getItem("profile-picture") ||
        '{"picture":"txt-prof","color":"#ff00ea","border":"none"}'
    );
    const image = imageKey(profilePicData.picture);
    const style = `
        position:relative;
        overflow:visible;
        background-image:url('${pre}/${image}');
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        background-color:${profilePicData.color};
        z-index:1;
    `;
    // style einfügen
    html = html.replace(
        new RegExp(`(<[^>]*id=["']${id}["'][^>]*)(>)`, "i"),
        `$1 style="${style}"$2`
    );
    // border
    if (profilePicData.border && profilePicData.border !== "none") {
        const i = profilePicData.border.indexOf(";");
        const type = profilePicData.border.substring(0, i);
        const param = profilePicData.border.substring(i + 1);
        let background = "";
        switch (type) {
            case "basic":
                background = param;
                break;
            case "gradient": {
                const [dir, ...colors] = JSON.parse(param);
                const dirs = {
                    top: "to top",
                    left: "to left",
                    topleft: "to top left",
                    topright: "to top right"
                };
                background = `linear-gradient(${dirs[dir] || "to right"}, ${colors.join(",")})`;
                break;
            }
            default:
                return html;
        }
        html = html.replace(
            new RegExp(`(<[^>]*id=["']${id}["'][^>]*>)([\\s\\S]*?)(</div>)`, "i"),
            `$1<div class="profile-border" style="
                position:absolute;
                inset:-3%;
                border-radius:50%;
                z-index:-1;
                pointer-events:none;
                background:${background};
                -webkit-mask:
                    radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px));
                mask:
                    radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px));
            "></div>$2$3`
        );
    }
    return html;
}

// html
export function loadProfileHTML(id, pre) {
    const div = document.getElementById(id);
    //session-storage
    const profilePicData = JSON.parse(
        sessionStorage.getItem("profile-picture")
        || '{"picture":"txt-prof","color":"#ff00ea","border":"none"}'
    );
    //Bild
    const image = imageKey(profilePicData.picture);
    div.style.backgroundImage = `url(${pre}/${image})`;
    div.style.backgroundSize = "cover";
    div.style.backgroundPosition = "center";
    div.style.backgroundRepeat = "no-repeat";
    //hintergrund
    div.style.backgroundColor = profilePicData.color;
    //rahmen
    applyBorder(div, profilePicData.border);
}

function applyBorder(div, borderString) {
    if (!borderString) return;
    const i = borderString.indexOf(";");
    const type = borderString.substring(0, i);
    const param = borderString.substring(i + 1);
    // Alten Rahmen entfernen
    const old = div.querySelector(".profile-border");
    if (old) old.remove();
    div.style.position = "relative";
    div.style.overflow = "visible";
    const border = document.createElement("div");
    border.className = "profile-border";
    Object.assign(border.style, {
        position: "absolute",
        inset: "-3%",
        borderRadius: "50%",
        zIndex: "1",
        pointerEvents: "none",
        WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))",
        mask:
            "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))"
    });
    switch (type) {
        case "basic":
            border.style.background = param;
            break;
        case "gradient": {
            const [dir, ...colors] = JSON.parse(param);
            const dirs = {
                top: "to top",
                left: "to left",
                topleft: "to top left",
                topright: "to top right"
            };
            border.style.background =
                `linear-gradient(${dirs[dir] || "to right"}, ${colors.join(",")})`;
            break;
        }
        default:
            return;
    }
    div.appendChild(border);
};

//helper
function imageKey(picId) {
    const images = {
        "txt-prof": "standard.png"
    };
    if (picId in images) {
        return "src/img/profilePics/" + images[picId];
    } else {
        if (picId[0] == "{") {
            const picIDJ = JSON.parse(picId);
            switch(picIDJ.type) {
                case "set":
                    return(
                        "src/img/sets/" +
                        picIDJ.set + "/" +
                        picIDJ.color + "/" +
                        picIDJ.figur + ".png"
                    );
            }
        } else {
            return "src/img/profilePics/" + picId + ".png";
        }
    }
}