

//---------Navbar-----------//

// Navbar Scrolling
let prevPos = window.scrollY;

window.addEventListener('scroll', function(){
    hideNav();
})

function hideNav() {
    const navbar = document.querySelector('navbar');
    const currentPos = window.scrollY;

    if (prevPos > currentPos){
        navbar.classList.remove('hidden');
    } else {
        navbar.classList.add('hidden');
    }
    prevPos = currentPos;
}






// Navbar Navigation Destinations
const projects = document.getElementById('projects-container');
const about = document.getElementById('about');
const contact = document.getElementById('contact');

// Navbar Anchor Tags
const homeLink = document.getElementById('home-l');
const projectsLink = document.getElementById('projects-l');
const aboutLink = document.getElementById('about-l');
const contactLink = document.getElementById('contact-l');

// Add EventListeners to the Navbar Anchor Tags
homeLink.addEventListener('click', function(){
    window.scrollTo(0,0);
})

projectsLink.addEventListener('click', function(){
    projects.scrollIntoView();
})

aboutLink.addEventListener('click', function(){
    about.scrollIntoView();
})

contactLink.addEventListener('click', function(){
    contact.scrollIntoView();
})

//---------End of Navbar-----------//














//------------Hero Animated Text-------------//
window.addEventListener('load', () => {
    const canvas = document.getElementById('home');
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

   

   

    const effect1 = new Effect(ctx, canvas.width, canvas.height, 'Will Ondrik', canvas.width/3, 200);
    const effect2 = new Effect(ctx, canvas.width, canvas.height, 'Full-Stack Developer', canvas.width/3, 200);
    
    effect1.wrapText();
    effect2.wrapText();
    effect1.render();
    effect2.render();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect1.render(); 
        effect2.render();
        requestAnimationFrame(animate);
    }
    animate();


    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effect1.resize(canvas.width, canvas.height);
        effect2.resize(canvas.width, canvas.height);
        effect1.wrapText();
        effect2.wrapText();
        
        console.log('resizing');
    })

});





class Particle {
    constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = 0;
        this.color = color;
        this.originX = x;
        this.originY = y;
        this.size = this.effect.gap; 
        this.dx = 0; 
        this.dy = 0; 
        this.vx = 0; 
        this.vy = 0; 
        this.force = 0; 
        this.angle = 0; 
        this.distance = 0;
        this.friction = Math.random() * 0.6 + 0.15;
        this.ease = Math.random() * 0.2 + 0.005;
    }

    draw() {
        this.effect.context.fillStyle = this.color;
        this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance; 
        
        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
}



class Effect {
    constructor(context, canvasWidth, canvasHeight, text, textX, textY) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.textX = textX;
        this.textY = textY;
        this.fontSize = canvasWidth * 0.05;
        this.lineHeight = this.fontSize * 0.8;
        this.maxTextWidth = this.canvasWidth * 0.8;
        this.text = text;
       
        this.particles = [];
        this.gap = 1;    
        this.mouse = {     
            radius: 20000,
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    wrapText(text){
        text = this.text;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0.3, 'red');
        gradient.addColorStop(0.5, 'fuchsia');
        gradient.addColorStop(0.7, 'purple');
        this.context.fillStyle = gradient;
        this.context.textAlign = 'end';
        this.context.textBaseLine = 'middle';
        this.context.lineWidth = 3;
        this.context.strokeStyle = 'white';
        this.context.font = this.fontSize + 'px Helvetica';
        let linesArray = [];               
        let words = text.split(' ');      
        let lineCounter = 0;
        let line = '';                      
        for (let i = 0; i < words.length; i++) {  
            let testLine = line + words[i] + ' '; 
            if (this.context.measureText(testLine).width > this.maxTextWidth) { 
                line = words[i] + ' ';             
                lineCounter++; 
            } else {            
                line = testLine;
            }
            linesArray[lineCounter] = line; 
        } 
        let textHeight = this.lineHeight * lineCounter;
        this.textY = this.canvasHeight / 2 - textHeight / 2;
        linesArray.forEach((element, index) => {
            this.context.fillText(element, this.textX, this.textY + (index * this.lineHeight));
            this.context.strokeText(element, this.textX, this.textY + (index * this.lineHeight));
        })
        this.converToParticles();

    }

    converToParticles() {
         this.particles = []; 
         const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
         for (let y = 0; y < this.canvasHeight; y += this.gap){
            for (let x = 0; x < this.canvasWidth; x += this.gap){
                const index = (y * this.canvasWidth + x) * 4;
                const alpha = pixels[index + 3];

                if (alpha > 0){
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    this.particles.push(new Particle(this, x, y, color));
                    
                }
            }
         }
    }

    render() {
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
    }

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.textX = this.canvasWidth/2;
        this.textY = this.canvasHeight/2;
        this.maxTextWidth = this.canvasWidth * 0.8;
    }
}