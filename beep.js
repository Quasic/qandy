function beep() {
  const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
  audio.play().catch(() => {}); // Catch errors for browsers that block autoplay
}
print(" beep ");