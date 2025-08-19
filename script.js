// 添加一些互動效果
document.addEventListener('DOMContentLoaded', function () {
    // 為所有連結添加點擊動畫
    const links = document.querySelectorAll('.link-item');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // 創建點擊波紋效果
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = e.clientX - this.offsetLeft + 'px';
            ripple.style.top = e.clientY - this.offsetTop + 'px';
            ripple.style.width = ripple.style.height = '20px';

            this.style.position = 'relative';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 添加滾動動畫
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 觀察所有卡片
    document.querySelectorAll('.profile-card, .links-section').forEach(card => {
        observer.observe(card);
    });
});
