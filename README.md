# HM Gallery

A lightweight, responsive, and fullscreen-ready image gallery built with jQuery.  
It features smooth transitions, thumbnail navigation, autoplay, an image counter, and a modern slide animation that reveals the next image during transitions.

HM Gallery was designed to be easy to integrate, pleasant to use, and simple to customize.

---

## 🔥 Demo

👉 Live Demo on CodePen  
https://codepen.io/hiltonmuccillo/pen/NPNzPdm

---

## 📦 Installation

### Using CDN (jsDelivr)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hiltonmuccillo/hm-gallery@main/dist/hmGallery.css">

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/hiltonmuccillo/hm-gallery@main/dist/jquery.hmGallery.js"></script>
```

### Minified versions

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hiltonmuccillo/hm-gallery@main/dist/hmGallery.min.css">
<script src="https://cdn.jsdelivr.net/gh/hiltonmuccillo/hm-gallery@main/dist/jquery.hmGallery.min.js"></script>
```

---

## 🧩 Usage

### HTML

```html
<div class="hm-gallery" id="galleryDemo">
    <img src="images/photo1.jpg" alt="Photo 1" data-caption="Caption 1">
    <img src="images/photo2.jpg" alt="Photo 2" data-caption="Caption 2">
    <img src="images/photo3.jpg" alt="Photo 3" data-caption="Caption 3">
</div>
```

### JavaScript

```javascript
$(function () {
    $('#galleryDemo').hmGallery({
        loop: true,
        enableFullscreen: true,
        autoplay: false,
        autoplayInterval: 4000,
        transition: 'slide',      // 'slide', 'fade', or 'none'
        animationDuration: 400    // milliseconds
    });
});
```

---

## ⚙️ Options

| Option              | Type    | Default  | Description                    |
| ------------------- | ------- | -------- | ------------------------------ |
| `startIndex`        | Number  | `0`      | Initial image index            |
| `loop`              | Boolean | `true`   | Repeats gallery from start/end |
| `enableFullscreen`  | Boolean | `true`   | Enables fullscreen mode        |
| `autoplay`          | Boolean | `false`  | Starts autoplay                |
| `autoplayInterval`  | Number  | `4000`   | Time between slides (ms)       |
| `transition`        | String  | `'fade'` | `'slide'`, `'fade'`, `'none'`  |
| `animationDuration` | Number  | `400`    | Transition duration (ms)       |

---

## 🖼 Captions

Add captions easily using:

```html
<img src="img.jpg" data-caption="My caption text">
```

---

## 📁 Folder Structure

```
hm-gallery/
│
├── dist/                # Production-ready CSS & JS (used in CDN)
│   ├── hmGallery.css
│   ├── hmGallery.min.css
│   ├── jquery.hmGallery.js
│   └── jquery.hmGallery.min.js
│
├── src/                 # Source files
│   ├── css/
│   └── js/
│
├── images/              # Demo images (not required for usage)
│
├── demo/                # Example gallery
│   └── index.html
│
├── README.md
└── LICENSE
```

---

## 📚 Features

✔ Smooth slide transition (with real next-image preview)  
✔ Fade transition  
✔ Autoplay + play/pause button  
✔ Fullscreen mode (gallery-only fullscreen)  
✔ Thumbnail navigation with scroll + arrows  
✔ Image counter (current / total)  
✔ Keyboard-friendly  
✔ Lightweight jQuery plugin  
✔ Responsive and touch-friendly  

---

## 🌐 Browser Support

- Chrome  
- Firefox  
- Safari  
- Edge  
- Opera  
- Android Chrome  
- iOS Safari  

---

## 📄 License

Released under the MIT License.

---

## 👤 Author

**Hilton Muccillo**  
Front-end Developer & Web Designer  
https://hiltonmuccillo.com

---

## ⭐ Support the Project

If you enjoyed HM Gallery, please consider giving the repository a star.  
It helps the project grow and encourages new features. 🚀