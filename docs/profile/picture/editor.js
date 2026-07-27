// definitions
import { loadProfileHTML } from "../../src/assets/profile.js";

const profile = JSON.parse(
    sessionStorage.getItem("profile-picture") ||
    '{"picture":"txt-prof","color":"#ff00ea","border":"none"}'
);

const presetColors = [
"#ffffff",
"#dddddd",
"#999999",
"#555555",
"#000000",

"#ff0000",
"#ff6600",
"#ffaa00",
"#ffee00",
"#aaff00",

"#00cc44",
"#00ffaa",
"#00ccff",
"#0088ff",
"#0044ff",

"#6633ff",
"#aa00ff",
"#ff00ff",
"#ff3399",
"#8b4513"
];

const borders = [

{ name:"Kein", value:"none" },

{ name:"Rot", value:"basic;red" },
{ name:"Orange", value:"basic;orange" },
{ name:"Gelb", value:"basic;gold" },
{ name:"Grün", value:"basic;limegreen" },
{ name:"Türkis", value:"basic;turquoise" },
{ name:"Blau", value:"basic;dodgerblue" },
{ name:"Lila", value:"basic;mediumorchid" },
{ name:"Pink", value:"basic;hotpink" },
{ name:"Weiß", value:"basic;white" },
{ name:"Schwarz", value:"basic;black" },

{ name:"Rot→Blau", value:'gradient;["left","red","blue"]' },
{ name:"Blau→Türkis", value:'gradient;["left","dodgerblue","cyan"]' },
{ name:"Pink", value:'gradient;["left","deeppink","violet"]' },
{ name:"Gold", value:'gradient;["top","gold","orange"]' },
{ name:"Feuer", value:'gradient;["top","red","orange","yellow"]' },
{ name:"Natur", value:'gradient;["top","green","lime"]' },
{ name:"Galaxy", value:'gradient;["left","#1a237e","#8e24aa","#ec407a"]' },
{ name:"Rainbow", value:'gradient;["left","red","orange","yellow","green","cyan","blue","violet"]' },
{ name:"Ice", value:'gradient;["top","white","cyan","#00bfff"]' },
{ name:"Sunset", value:'gradient;["left","#ff9800","#ff4081","#7b1fa2"]' }

];

// hintergrund & rand
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

// bilder
async function loadPictures() {
    const pictureList = document.getElementById("pictureList");
    if (!pictureList) return;
    const res = await fetch("../../src/img/profilePics/list.json");
    const pictures = await res.json();
    Object.entries(pictures).forEach(([filename, displayName]) => {
        const id = filename.replace(".png", "");
        const item = document.createElement("div");
        item.className = "pictureItem";
        item.innerHTML = `
            <div class="picturePreview">
                <img src="../../src/img/profilePics/${filename}">
            </div>
            <span>${displayName}</span>
        `;
        item.onclick = () => {
            profile.picture = id;
            update();
        };
        pictureList.appendChild(item);
    });
    const loadMore = document.createElement("div");
    loadMore.className = "loadMoreItem";
    loadMore.innerHTML = `
        <div class="loadMorePreview">
            <div class="loader"></div>
        </div>
        <span>Mehr laden</span>
    `;
    loadMore.onclick = () => {
        loadMorePictures();
    };
    pictureList.appendChild(loadMore);
}
//bilder-laden-funktion
async function loadMorePictures(){
    const button = document.querySelector(".loadMoreItem");
    if(button){
        button.remove();
    }
    await loadSets();
}
async function loadSets(){
    try{
        const ipRes = await fetch("../../api/ip.txt");
        const ip = (await ipRes.text()).trim();
        const code = sessionStorage.getItem("session-id");
        if(!code){
            console.warn("Kein Code im SessionStorage");
            return;
        }
        const res = await fetch(
            `${ip}/skins/sets?code=${code}`
        );
        const data = await res.json();
        renderSets(data.sets || []);
    }catch(err){
        console.error("Fehler beim Laden der Sets:",err);
    }
}
function renderSets(sets){
    const pictureList =
        document.getElementById("pictureList");
    sets.forEach(set=>{
        const item=document.createElement("div");
        item.className="setItem";
        item.innerHTML=`
            <div class="setPreview">
                <img src="../../src/img/sets/${set}/icon.png">
            </div>
            <span>${set}</span>
        `;
        item.onclick=()=>{
            openSetOverlay(set);
        };
        pictureList.appendChild(item);
    });
}
function openSetOverlay(set){
    const overlay=document.createElement("div");
    overlay.id="setOverlay";
    overlay.innerHTML=`
        <div class="setWindow">
            <h2>${set}</h2>
            <div class="figureList"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    const list =
        overlay.querySelector(".figureList");
    const colors=[
        "white",
        "black"
    ];
    const figuren=[
        "b",
        "k",
        "d",
        "t",
        "l",
        "s"
    ];
    colors.forEach(color=>{
        figuren.forEach(figur=>{
            const item=document.createElement("div");
            item.className="figureItem";
            item.innerHTML=`
                <img src="../../src/img/sets/${set}/${color}/${figur}.png">
            `;
            item.onclick=()=>{
                profile.picture={
                    type:"set",
                    set:set,
                    color:color,
                    figur:figur
                };
                update();
                overlay.remove();
            };
            list.appendChild(item);
        });
    });
    overlay.onclick=(e)=>{
        if(e.target===overlay){
            overlay.remove();
        }
    };
}

//runner
update();
loadPictures();