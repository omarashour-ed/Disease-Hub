window.onload = function() {
    // Your JavaScript code here
    // Your code here
    let menuBtn = document.querySelector("#menuBtn");
    let curs = document.querySelector(".cursor");
    let menuItems = document.querySelectorAll(".menu-item");
    let mainText = document.querySelector(".mainText");

    document.addEventListener("mousemove", (e) => {
        let x = e.pageX;
        let y = e.pageY;
        curs.style.left = x - 15 + "px";
        curs.style.top = y - 15 + "px";
    });

// show hide menu animation
    let flag = true;
    menuBtn.addEventListener("click", () => {
        flag = !flag;

        if (!flag) {
            gsap.to(".straight-line", {
                width: 700,
                duration: 0.3
            });
            gsap.to(".menu", {
                display: "block",
                duration: 0.3
            });
        } else {
            gsap.to(".straight-line", {
                width: 0,
                duration: 0.2
            });
            gsap.to(".menu", {
                display: "none",
                duration: 0.2
            });
        }
    });

// menu item click animation and changing maim title

    menuItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            curs.classList.add("explosion");
            setTimeout(function () {
                curs.classList.remove("explosion");
            }, 900);
        });
    });
};




