import { loadProfileHTML } from "../../src/assets/profile.js";

const profile = JSON.parse(
    sessionStorage.getItem("profile-picture") ||
    '{"picture":"txt-prof","color":"#ff00ea","border":"none"}'
);

const presetColors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#ff8800",
    "#ffee00",
    "#00bb44",
    "#00bbff",
    "#0044ff",
    "#8844ff",
    "#ff00ff"
];

const borders = [
    {
        name: "Kein",
        value: "none"
    },
    {
        name: "Rot",
        value: "basic;red"
    },
    {
        name: "Blau",
        value: "basic;dodgerblue"
    },
    {
        name: "Gold",
        value: "basic;gold"
    },
    {
        name: "Regenbogen",
        value: 'gradient;["top","red","orange","yellow","green","cyan","blue","violet"]'
    },
    {
        name: "Pink",
        value: 'gradient;["top","#ff00ff","#ff66cc"]'
    },
    {
        name: "Blau Verlauf",
        value: 'gradient;["left","#00bbff","#0044ff"]'
    }
];

const picker = document.getElementById("colorPicker");
const presets = document.getElementById("presetColors");
const list = document.getElementById("borderList");

function update() {
    sessionStorage.setItem(
        "profile-picture",
        JSON.stringify(profile)
    );

    loadProfileHTML(
        "profilePreview",
        "../.."
    );
}

picker.value = profile.color;

picker.oninput = () => {
    profile.color = picker.value;
    update();
};

presetColors.forEach(color => {

    const div = document.createElement("div");

    div.className = "color";
    div.style.background = color;

    div.onclick = () => {
        picker.value = color;
        profile.color = color;
        update();
    };

    presets.appendChild(div);

});

borders.forEach(border => {

    const item = document.createElement("div");

    item.className = "borderItem";

    item.innerHTML = `
        <div class="borderPreview"></div>
        <span>${border.name}</span>
    `;

    const preview = item.querySelector(".borderPreview");

    preview.style.background = "#555";

    if (border.value !== "none") {

        const borderDiv = document.createElement("div");

        borderDiv.className = "profile-border";

        Object.assign(borderDiv.style, {
            position: "absolute",
            inset: "-8%",
            borderRadius: "50%",
            pointerEvents: "none",
            mask: "radial-gradient(farthest-side,transparent calc(100% - 4px),black calc(100% - 4px))",
            WebkitMask: "radial-gradient(farthest-side,transparent calc(100% - 4px),black calc(100% - 4px))"
        });

        if (border.value.startsWith("basic")) {

            borderDiv.style.background =
                border.value.split(";")[1];

        } else {

            const txt =
                border.value.substring(border.value.indexOf(";") + 1);

            const [dir, ...colors] = JSON.parse(txt);

            const dirs = {
                top: "to top",
                left: "to left",
                topleft: "to top left",
                topright: "to top right"
            };

            borderDiv.style.background =
                `linear-gradient(${dirs[dir]}, ${colors.join(",")})`;
        }

        preview.appendChild(borderDiv);
    }

    item.onclick = () => {
        profile.border = border.value;
        update();
    };

    list.appendChild(item);

});

update();