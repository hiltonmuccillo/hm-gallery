/*!
 * HM Gallery - jQuery image gallery with thumbnails, fullscreen and autoplay
 * Author: Hilton Muccillo
 */

(function ($) {

    var defaults = {
        startIndex: 0,
        loop: true,
        enableFullscreen: true,
        autoplay: false,
        autoplayInterval: 4000,
        transition: 'fade',       // 'fade' | 'slide' | 'none'
        animationDuration: 400    // ms
    };

    function HmGallery($container, options) {
        this.$container = $container;
        this.settings = $.extend({}, defaults, options);
        this.items = [];
        this.currentIndex = 0;

        this.$inner = null;
        this.$main = null;
        this.$mainImg = null;
        this.$caption = null;

        this.$thumbsScroll = null;
        this.$thumbsTrack = null;

        this.$fullscreenBtn = null;
        this._handleFsChange = null;

        this.autoplayTimer = null;
        this.autoplayInterval = this.settings.autoplayInterval;
        this.isPlaying = false;
        this.$autoplayBtn = null;

        this.$counter = null;
        this._initialized = false;

        this.init();
    }

    HmGallery.prototype.init = function () {
        var self = this;

        var $imgs = this.$container.find('img');
        if (!$imgs.length) return;

        $imgs.each(function (index, img) {
            var $img = $(img);
            self.items.push({
                src: $img.attr('src'),
                alt: $img.attr('alt') || '',
                caption: $img.data('caption') || ''
            });
        });

        $imgs.hide();

        this.buildMarkup();

        var startIndex = this.settings.startIndex;
        if (startIndex < 0 || startIndex >= this.items.length) {
            startIndex = 0;
        }
        this.goTo(startIndex, { instant: true });

        if (this.settings.enableFullscreen !== false) {
            this._handleFsChange = this.onFullscreenChange.bind(this);
            document.addEventListener('fullscreenchange', this._handleFsChange);
            document.addEventListener('webkitfullscreenchange', this._handleFsChange);
            document.addEventListener('mozfullscreenchange', this._handleFsChange);
            document.addEventListener('MSFullscreenChange', this._handleFsChange);
        }

        if (this.settings.autoplay) {
            this.startAutoplay();
        }
    };

    HmGallery.prototype.buildMarkup = function () {
        var self = this;

        this.$inner = $('<div class="hm-gallery-inner"></div>');

        this.$main = $('<div class="hm-gallery-main"></div>');
        var $prevBtn = $('<button type="button" class="hm-gallery-nav-btn hm-gallery-prev" aria-label="Previous">‹</button>');
        var $nextBtn = $('<button type="button" class="hm-gallery-nav-btn hm-gallery-next" aria-label="Next">›</button>');

        this.$mainImg = $('<img src="" alt="">');
        this.$caption = $('<div class="hm-gallery-caption" aria-live="polite"></div>');

        this.$autoplayBtn = $('<button type="button" class="hm-gallery-autoplay-btn" aria-label="Play/Pause slideshow"></button>');
        this.$main.append(this.$autoplayBtn);

        if (this.settings.enableFullscreen !== false) {
            this.$fullscreenBtn = $('<button type="button" class="hm-gallery-fs-btn" aria-label="Fullscreen" aria-pressed="false"></button>');
            this.$main.append(this.$fullscreenBtn);
        }

        this.$counter = $('<div class="hm-gallery-counter"></div>');
        this.$main.append(this.$counter);

        this.$main.append($prevBtn, this.$mainImg, this.$caption, $nextBtn);

        var $thumbsWrapper = $('<div class="hm-gallery-thumbs"></div>');
        this.$thumbsScroll = $('<div class="hm-gallery-thumbs-scroll"></div>');
        this.$thumbsTrack = $('<div class="hm-gallery-thumbs-track"></div>');

        var $thumbsPrev = $('<button type="button" class="hm-gallery-thumbs-nav hm-gallery-thumbs-prev" aria-label="Previous thumbnails">‹</button>');
        var $thumbsNext = $('<button type="button" class="hm-gallery-thumbs-nav hm-gallery-thumbs-next" aria-label="Next thumbnails">›</button>');

        this.items.forEach(function (item, index) {
            var $btn = $('<button type="button" class="hm-gallery-thumb" data-index="' + index + '"></button>');
            var $thumbImg = $('<img>').attr({
                src: item.src,
                alt: item.alt
            });
            $btn.append($thumbImg);
            self.$thumbsTrack.append($btn);
        });

        this.$thumbsScroll.append(this.$thumbsTrack);
        $thumbsWrapper.append($thumbsPrev, this.$thumbsScroll, $thumbsNext);

        this.$inner.append(this.$main, $thumbsWrapper);
        this.$container.addClass('hm-gallery--initialized').append(this.$inner);

        $prevBtn.on('click', function () { self.prev(); });
        $nextBtn.on('click', function () { self.next(); });

        this.$thumbsTrack.on('click', '.hm-gallery-thumb', function () {
            var index = parseInt($(this).data('index'), 10);
            self.goTo(index);
        });

        $thumbsPrev.on('click', function () {
            self.scrollThumbs('prev');
        });
        $thumbsNext.on('click', function () {
            self.scrollThumbs('next');
        });

        if (this.$fullscreenBtn) {
            this.$fullscreenBtn.on('click', function () {
                self.toggleFullscreen();
            });
        }

        this.$autoplayBtn.on('click', function () {
            self.toggleAutoplay();
        });
    };

    HmGallery.prototype.scrollThumbs = function (direction) {
        if (!this.$thumbsScroll) return;
        var container = this.$thumbsScroll[0];
        var amount = 200;
        var delta = direction === 'next' ? amount : -amount;

        if (container.scrollBy) {
            container.scrollBy({ left: delta, behavior: 'smooth' });
        } else {
            container.scrollLeft += delta;
        }
    };

    HmGallery.prototype._updateMainImage = function (item, prevIndex, newIndex, options) {
        options = options || {};
        var transition = this.settings.transition || 'none';
        var duration = this.settings.animationDuration || 400;

        if (options.instant || !this._initialized || transition === 'none') {
            this.$mainImg.stop(true, true).css({ opacity: 1 });
            this.$mainImg.attr({
                src: item.src,
                alt: item.alt
            });
            this._initialized = true;
            return;
        }

        this.$mainImg.stop(true, true);

        var direction = (newIndex > prevIndex) ? 1 : -1;

        if (transition === 'fade') {
            this.$mainImg.css({ opacity: 0 });
            this.$mainImg.attr({
                src: item.src,
                alt: item.alt
            });
            this.$mainImg.animate({ opacity: 1 }, duration);

        } else if (transition === 'slide') {
            var self = this;
            this.$main.css('position', 'relative');

            var $old = $('<img class="hm-gallery-slide-img hm-gallery-slide-old">').attr({
                src: this.$mainImg.attr('src'),
                alt: this.$mainImg.attr('alt')
            });

            var $next = $('<img class="hm-gallery-slide-img hm-gallery-slide-new">').attr({
                src: item.src,
                alt: item.alt
            });

            $old.css({ left: '50%' });
            $next.css({ left: (direction === 1 ? '150%' : '-50%') });

            this.$mainImg.css('opacity', 0);

            this.$main.append($old, $next);

            var oldTargetLeft = (direction === 1 ? '-50%' : '150%');
            var nextTargetLeft = '50%';

            $old.animate({ left: oldTargetLeft }, duration);
            $next.animate({ left: nextTargetLeft }, duration, function () {
                self.$mainImg.attr({
                    src: item.src,
                    alt: item.alt
                });
                self.$mainImg.css('opacity', 1);
                $old.remove();
                $next.remove();
            });

        } else {
            this.$mainImg.attr({
                src: item.src,
                alt: item.alt
            });
        }
    };

    HmGallery.prototype.goTo = function (index, options) {
        options = options || {};
        var total = this.items.length;
        if (!total) return;

        var prevIndex = this.currentIndex;

        if (index < 0 || index >= total) {
            if (!this.settings.loop) return;
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
        }

        this.currentIndex = index;
        var item = this.items[index];

        if (this.$counter) {
            var current = index + 1;
            this.$counter.text(current + ' / ' + total);
        }

        if (item.caption) {
            this.$caption.text(item.caption).show();
        } else {
            this.$caption.text('').hide();
        }

        this.$thumbsTrack.find('.hm-gallery-thumb').removeClass('is-active');
        var $activeThumb = this.$thumbsTrack
            .find('.hm-gallery-thumb[data-index="' + index + '"]')
            .addClass('is-active');

        if (this.$thumbsScroll && $activeThumb.length) {
            var container = this.$thumbsScroll[0];
            var trackRect = container.getBoundingClientRect();
            var thumbRect = $activeThumb[0].getBoundingClientRect();

            if (thumbRect.left < trackRect.left) {
                container.scrollLeft += (thumbRect.left - trackRect.left);
            } else if (thumbRect.right > trackRect.right) {
                container.scrollLeft += (thumbRect.right - trackRect.right);
            }
        }

        this._updateMainImage(item, prevIndex, index, options);

        if (this.isPlaying && !options.fromAutoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    };

    HmGallery.prototype.next = function () {
        this.goTo(this.currentIndex + 1);
    };

    HmGallery.prototype.prev = function () {
        this.goTo(this.currentIndex - 1);
    };

    HmGallery.prototype.startAutoplay = function () {
        var self = this;
        if (this.isPlaying) return;

        this.isPlaying = true;
        if (this.$autoplayBtn) {
            this.$autoplayBtn.addClass('is-playing');
        }

        this.autoplayTimer = setInterval(function () {
            self.goTo(self.currentIndex + 1, { fromAutoplay: true });
        }, this.autoplayInterval);
    };

    HmGallery.prototype.stopAutoplay = function () {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        if (this.$autoplayBtn) {
            this.$autoplayBtn.removeClass('is-playing');
        }

        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
    };

    HmGallery.prototype.toggleAutoplay = function () {
        if (this.isPlaying) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    };

    HmGallery.prototype._getFullscreenElement = function () {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null;
    };

    HmGallery.prototype.isFullscreen = function () {
        var elem = this._getFullscreenElement();
        if (elem) {
            return elem === this.$container[0];
        }
        return this.$container.hasClass('hm-gallery--fullscreen');
    };

    HmGallery.prototype.enterFullscreen = function () {
        var el = this.$container[0];
        if (!el) return;

        var req = el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;

        if (req) {
            req.call(el);
        } else {
            this.setFullscreenClass(true);
        }
    };

    HmGallery.prototype.exitFullscreen = function () {
        var exit = document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.msExitFullscreen;

        if (exit && this._getFullscreenElement()) {
            exit.call(document);
        } else {
            this.setFullscreenClass(false);
        }
    };

    HmGallery.prototype.toggleFullscreen = function () {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    };

    HmGallery.prototype.setFullscreenClass = function (isFs) {
        this.$container.toggleClass('hm-gallery--fullscreen', !!isFs);

        if (this.$fullscreenBtn) {
            this.$fullscreenBtn.toggleClass('is-active', !!isFs);
            this.$fullscreenBtn.attr('aria-pressed', isFs ? 'true' : 'false');
        }
    };

    HmGallery.prototype.onFullscreenChange = function () {
        var elem = this._getFullscreenElement();
        var isFs = (elem === this.$container[0]);
        this.setFullscreenClass(isFs);
    };

    $.fn.hmGallery = function (options) {
        return this.each(function () {
            var $this = $(this);
            var instance = $this.data('hmGallery');

            if (!instance) {
                instance = new HmGallery($this, options);
                $this.data('hmGallery', instance);
            }
        });
    };

})(jQuery);
