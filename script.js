/* ═══════════════════════════════════
   LEGIT.ai — Script Controller
   ═══════════════════════════════════ */

// ═══ GLOBAL AUDIO SETUP ═══
let audioCtx = null;
let audioUnlocked = false;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}
document.addEventListener('click', () => { audioUnlocked = true; if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }, { once: false });
document.addEventListener('touchstart', () => { audioUnlocked = true; if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }, { once: false });

const SoundFX = {
    ding() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    },
    phaaa() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), now = ctx.currentTime;
        const osc1 = ctx.createOscillator(), gain1 = ctx.createGain(), filter1 = ctx.createBiquadFilter();
        osc1.connect(filter1); filter1.connect(gain1); gain1.connect(ctx.destination);
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(300, now); osc1.frequency.exponentialRampToValueAtTime(60, now + 0.8);
        filter1.type = 'lowpass'; filter1.frequency.setValueAtTime(800, now); filter1.frequency.exponentialRampToValueAtTime(100, now + 0.8); filter1.Q.value = 8;
        gain1.gain.setValueAtTime(0.4, now); gain1.gain.setValueAtTime(0.4, now + 0.1); gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc1.start(now); osc1.stop(now + 0.9);
        const osc2 = ctx.createOscillator(), gain2 = ctx.createGain();
        osc2.connect(gain2); gain2.connect(ctx.destination); osc2.type = 'sine';
        osc2.frequency.setValueAtTime(80, now); osc2.frequency.exponentialRampToValueAtTime(30, now + 0.5);
        gain2.gain.setValueAtTime(0.5, now); gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.start(now); osc2.stop(now + 0.6);
        const bufSz = ctx.sampleRate * 0.1, buf = ctx.createBuffer(1, bufSz, ctx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < bufSz; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufSz);
        const ns = ctx.createBufferSource(), ng = ctx.createGain(), nf = ctx.createBiquadFilter();
        ns.buffer = buf; ns.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
        nf.type = 'bandpass'; nf.frequency.value = 1000;
        ng.gain.setValueAtTime(0.3, now); ng.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        ns.start(now);
    },
    pop() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
    },
    whoosh() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), sz = ctx.sampleRate * 0.3, buf = ctx.createBuffer(1, sz, ctx.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < sz; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / sz);
        const src = ctx.createBufferSource(), flt = ctx.createBiquadFilter(), gain = ctx.createGain();
        src.buffer = buf; src.connect(flt); flt.connect(gain); gain.connect(ctx.destination);
        flt.type = 'bandpass'; flt.frequency.setValueAtTime(2000, ctx.currentTime); flt.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        src.start(ctx.currentTime);
    },
    tada() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx();
        [523, 659, 784, 1047].forEach((freq, i) => {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination); osc.type = 'triangle'; osc.frequency.value = freq;
            const t = ctx.currentTime + i * 0.12;
            gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.3, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.start(t); osc.stop(t + 0.4);
        });
    },
    typewriter() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination); osc.type = 'square';
        osc.frequency.value = 800 + Math.random() * 400;
        gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.04);
    },
    collapse() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), now = ctx.currentTime;
        const crO = ctx.createOscillator(), crG = ctx.createGain();
        crO.connect(crG); crG.connect(ctx.destination); crO.type = 'sawtooth';
        crO.frequency.setValueAtTime(150, now); crO.frequency.exponentialRampToValueAtTime(20, now + 0.3);
        crG.gain.setValueAtTime(0.6, now); crG.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        crO.start(now); crO.stop(now + 0.3);
        const rSz = ctx.sampleRate * 3, rB = ctx.createBuffer(1, rSz, ctx.sampleRate), rD = rB.getChannelData(0);
        for (let i = 0; i < rSz; i++) rD[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rSz, 0.5);
        const rS = ctx.createBufferSource(), rF = ctx.createBiquadFilter(), rG = ctx.createGain();
        rS.buffer = rB; rS.connect(rF); rF.connect(rG); rG.connect(ctx.destination);
        rF.type = 'lowpass'; rF.frequency.value = 150;
        rG.gain.setValueAtTime(0, now + 0.1); rG.gain.linearRampToValueAtTime(0.8, now + 0.4); rG.gain.exponentialRampToValueAtTime(0.001, now + 3.5);
        rS.start(now + 0.1);
        for (let d = 0; d < 12; d++) {
            const dt = now + 0.2 + Math.random() * 2.5, dO = ctx.createOscillator(), dG = ctx.createGain();
            dO.connect(dG); dG.connect(ctx.destination); dO.type = 'square'; dO.frequency.value = 200 + Math.random() * 800;
            dG.gain.setValueAtTime(0.1 + Math.random() * 0.2, dt); dG.gain.exponentialRampToValueAtTime(0.001, dt + 0.1 + Math.random() * 0.2);
            dO.start(dt); dO.stop(dt + 0.3);
        }
        const tO = ctx.createOscillator(), tG = ctx.createGain();
        tO.connect(tG); tG.connect(ctx.destination); tO.type = 'sine';
        tO.frequency.setValueAtTime(60, now + 0.5); tO.frequency.exponentialRampToValueAtTime(15, now + 1.5);
        tG.gain.setValueAtTime(0, now + 0.5); tG.gain.linearRampToValueAtTime(0.9, now + 0.7); tG.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
        tO.start(now + 0.5); tO.stop(now + 3.0);
    },
    error() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination); osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime); osc.frequency.setValueAtTime(120, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
    },
    cash() {
        if (!audioUnlocked) return;
        const ctx = getAudioCtx();
        [1200, 1600, 2000].forEach((freq, i) => {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.value = freq;
            const t = ctx.currentTime + i * 0.06;
            gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.start(t); osc.stop(t + 0.15);
        });
    }
};

// ═══ 1. LOADING SCREEN ═══
const loadingMessages = [
    "Initializing intelligence modules...",
    "Analyzing your productivity potential...",
    "Detecting that you opened 9 other tabs before this one...",
    "Noting suspicious levels of procrastination...",
    "Cross-referencing your scroll speed with ambition levels...",
    "Calibrating your excuse database...",
    "Running empathy simulation... failed... skipping...",
    "Almost done... saving your vibe for later...",
    "We know enough. Welcome."
];
const funFacts = [
    "Fun fact: This loading screen is longer than our testing phase.",
    "Fun fact: 73% of statistics on this site are made up.",
    "Fun fact: Our CEO once described the product as 'vibes-based computing'.",
    "Fun fact: This app was built on a dare.",
    "Fun fact: Our server runs on optimism and a single Raspberry Pi.",
    "Fun fact: We have more loading messages than features.",
    "Fun fact: The 'AI' is just a bunch of if-else statements with confidence.",
    "Fun fact: No interns were harmed. One was mildly inconvenienced.",
    "Fun fact: You've now spent more time here than our QA team did."
];

function initLoadingScreen() {
    const messageEl = document.getElementById('loading-message');
    const barEl = document.getElementById('loading-bar');
    const funFactEl = document.getElementById('loading-fun-fact');
    const loadingScreen = document.getElementById('loading-screen');
    const appContent = document.getElementById('app-content');
    const TOTAL_DURATION = 14000;
    const INTERVAL = TOTAL_DURATION / loadingMessages.length;
    let idx = 0;
    showMessage();
    const timer = setInterval(() => {
        idx++;
        if (idx >= loadingMessages.length) {
            clearInterval(timer);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                appContent.classList.add('visible');
                startDashboardAnimations();
                startRotatingTagline();
                try { SoundFX.ding(); } catch(e) {}
            }, 500);
            return;
        }
        showMessage();
    }, INTERVAL);
    function showMessage() {
        messageEl.classList.remove('visible');
        setTimeout(() => {
            messageEl.textContent = loadingMessages[idx];
            messageEl.classList.add('visible');
            barEl.style.width = `${((idx + 1) / loadingMessages.length) * 100}%`;
            funFactEl.textContent = funFacts[idx] || '';
            try { SoundFX.typewriter(); } catch(e) {}
        }, 250);
    }
}

// ═══ 2. ROTATING TAGLINE ═══
const taglines = ["Vaguely tested.", "Probably fine.", "Kevin approved.", "No refunds.", "Works on our machine.", "Buzzword compliant.", "Blockchain-free.", "Not a virus. Probably."];
function startRotatingTagline() {
    const el = document.getElementById('rotating-tagline');
    if (!el) return;
    let i = 0, charIdx = 0, isDeleting = false;
    function tick() {
        const current = taglines[i];
        if (!isDeleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) { setTimeout(() => { isDeleting = true; tick(); }, 2000); return; }
            setTimeout(tick, 60);
        } else {
            el.textContent = current.substring(0, charIdx);
            charIdx--;
            if (charIdx < 0) { isDeleting = false; i = (i + 1) % taglines.length; charIdx = 0; setTimeout(tick, 400); return; }
            setTimeout(tick, 30);
        }
    }
    tick();
}

// ═══ 3. DASHBOARD ANIMATIONS ═══
function startDashboardAnimations() {
    animateValue('dash-tasks', 0, 42, 2000);
    animateValue('dash-coffee', 0, 12, 2000);
    animateValue('dash-excuses', 0, 37, 2500);
    setTimeout(() => {
        const fill = document.getElementById('vibe-fill');
        const label = document.getElementById('vibe-label');
        if (fill) fill.style.width = '73%';
        if (label) label.textContent = 'Suspicious ⚡';
    }, 1000);
}
function animateValue(id, start, end, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    const range = end - start, startTime = performance.now();
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(start + range * easeOutCubic(progress));
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// ═══ 4. NAVBAR ═══
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 20); });
    hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); });
    navLinks.querySelectorAll('a').forEach(a => { a.addEventListener('click', () => navLinks.classList.remove('active')); });
}

// ═══ 5. SCROLL ANIMATIONS & COUNTERS ═══
function initScrollAnimations() {
    const fades = document.querySelectorAll('.scroll-fade, .scroll-reveal');
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    fades.forEach(el => observer.observe(el));
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) { counted = true; startStatCounters(); }
        }, { threshold: 0.3 });
        statsObserver.observe(statsRow);
    }
    function startStatCounters() {
        stats.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isPercent = stat.getAttribute('data-type') === 'percent';
            const isX = stat.getAttribute('data-type') === 'x';
            const duration = 2000, steps = 60, stepValue = target / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += stepValue;
                if (current >= target) { current = target; clearInterval(timer); }
                let text = isPercent ? current.toFixed(1) : Math.floor(current).toLocaleString();
                if (isPercent) text += '%'; if (isX) text += 'x'; if (!isPercent && !isX) text += '+';
                stat.textContent = text;
            }, duration / steps);
        });
    }
}

// ═══ 6. AI CHAT BOX (with FEATURE 3: TYPING SPEED ROAST) ═══
const aiResponses = [
    "Great question! Unfortunately, I have no idea. But I appreciate your trust in me. 🤖",
    "I've analyzed your input thoroughly and arrived at... nothing useful. But I gave it my best!",
    "Interesting. My advanced neural networks suggest you should probably Google that instead.",
    "Error: Too much intelligence detected in your question. Please dumb it down for me.",
    "After consulting with my 47 billion parameters, I recommend: taking a nap. 💤",
    "That's a fascinating point. Let me process it... *pretends to think* ... I got nothing.",
    "Fun fact: I'm not actually AI. I'm just a very fast typist named Kevin.",
    "Your query has been forwarded to our Senior VP of Making Things Up. Reply expected: never.",
    "I'd answer that, but my license to be helpful expired last Tuesday.",
    "Hmm, let me think... *elevator music* ... okay, I'm going to go with 'maybe'.",
    "Sources: trust me bro.",
    "That question is above my pay grade. And I don't get paid. So everything is above my pay grade.",
    "I ran your question through our proprietary algorithm. The algorithm said 'lol'.",
    "My training data says the answer is 42. I don't know the question, but the answer is 42.",
    "Absolutely! Wait, what was the question? I was distracted by my own brilliance.",
];

function initChatBox() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');
    let typingStart = null;

    // Track typing start
    input.addEventListener('input', () => { if (!typingStart) typingStart = Date.now(); });
    input.addEventListener('keypress', () => { if (!typingStart) typingStart = Date.now(); });

    function sendMessage() {
        const text = input.value.trim();
        
        if (!text) {
            addBotMessage("You sent nothing. Bold move. I respect it. 🫡");
            typingStart = null;
            return;
        }

        // Add user message
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = text;
        messages.appendChild(userBubble);
        input.value = '';

        // Calculate WPM for typing speed roast
        let response = null;
        if (typingStart) {
            const timeMs = Date.now() - typingStart;
            const timeMin = timeMs / 60000;
            const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
            const wpm = timeMin > 0 ? Math.round(wordCount / timeMin) : 0;

            if (wpm > 80) {
                response = "Whoa. You typed that at " + wpm + " WPM. Overcompensating for something? Our servers felt rushed. 🏃";
            } else if (wpm < 5 && text.length > 10) {
                response = "That took a while. Our AI went for a walk, made coffee, and came back. We're glad you made it. ☕";
            }
        }

        if (!response && text.length <= 3) {
            response = "A message of " + text.length + " characters. Efficient. Mysterious. We respect the chaos. 🎭";
        } else if (!response && text === text.toUpperCase() && text.length > 5) {
            response = "ALL CAPS DETECTED. Our AI is now also shouting internally. PLEASE ADVISE. 📢";
        } else if (!response && text.match(/\?.*\?.*\?/)) {
            response = "Three question marks. The desperation is palpable. We feel it. We also have questions. So many questions. ❓";
        } else if (!response && text.toLowerCase().includes('kevin')) {
            response = "You mentioned Kevin. Kevin has been notified. Kevin is unavailable. Kevin is always unavailable. 🫥";
        } else if (!response && (text.toLowerCase().includes('refund') || text.toLowerCase().includes('money'))) {
            response = "Ah. The refund question. Bold of you to ask this to the AI that can't process payments. Or feelings. Or refunds. 💸";
        } else if (!response && text.toLowerCase().includes('help')) {
            response = "You asked for help. That's brave. Unfortunately I am the help. I know. I'm sorry. 🫂";
        }

        if (!response) {
            response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        }

        typingStart = null;

        setTimeout(() => { addBotMessage(response); }, 800 + Math.random() * 1200);
    }

    function addBotMessage(text) {
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.innerHTML = '<span class="chat-name">LEGIT.ai Bot 🤖</span>' + text;
        messages.appendChild(botBubble);
        messages.scrollTop = messages.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    const askAiBtn = document.getElementById('ask-ai-btn');
    if (askAiBtn) {
        askAiBtn.addEventListener('click', () => {
            document.querySelector('.fun-section').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => input.focus(), 600);
        });
    }
}

// ═══ 7. MODAL (PHASE 3) ═══
let userHasBeenReviewed = false;
function initModal() {
    const modal = document.getElementById('review-modal');
    const closeBtn = document.getElementById('modal-close');
    const badge = document.getElementById('persistent-badge');
    const dateEl = document.getElementById('review-date');
    const reviewTextEl = document.getElementById('review-text-dynamic');
    const btnOkayFine = document.getElementById('btn-okay-fine');
    const btnRespond = document.getElementById('btn-respond');
    const btnSubmitResponse = document.getElementById('btn-submit-response');
    const btnFinalOkay = document.getElementById('btn-final-okay');
    const btnRejectionClose = document.getElementById('btn-rejection-close');
    const step1 = document.getElementById('modal-step-1');
    const step2 = document.getElementById('modal-step-2');
    const step3 = document.getElementById('modal-step-3');
    const step4 = document.getElementById('modal-step-4');
    const step5 = document.getElementById('modal-step-5');
    const allSteps = [step1, step2, step3, step4, step5];
    const reviewOptions = [
        "Spent more time on the pricing page than any other section. Commitment issues detected.",
        "Scrolled past the features section unusually fast. Either already an expert or simply avoiding responsibility.",
        "Paused longest on the testimonials. Trust issues noted. Relatable, honestly.",
        "Arrived here with 7+ tabs open based on our completely unverified estimation."
    ];
    function showView(v) { allSteps.forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); }); v.classList.remove('hidden'); v.classList.add('active'); if (v === step5) setTimeout(() => { try { SoundFX.phaaa(); } catch(e) {} }, 300); }
    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.remove('hidden');
        try { SoundFX.whoosh(); } catch(e) {}
        if (userHasBeenReviewed) { showView(step5); return; }
        dateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        reviewTextEl.textContent = reviewOptions[Math.floor(Math.random() * reviewOptions.length)];
        showView(step1);
    }
    document.querySelectorAll('.cta-btn').forEach(btn => btn.addEventListener('click', openModal));
    closeBtn.addEventListener('click', () => { modal.classList.add('hidden'); try { SoundFX.error(); } catch(e) {} });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    btnOkayFine.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} showView(step2); });
    btnRespond.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} showView(step3); });
    btnSubmitResponse.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} showView(step4); });
    btnFinalOkay.addEventListener('click', () => { modal.classList.add('hidden'); badge.classList.remove('hidden'); userHasBeenReviewed = true; });
    btnRejectionClose.addEventListener('click', () => modal.classList.add('hidden'));

    // Helpful / Not Helpful
    const btnHelpful = document.getElementById('btn-helpful');
    const btnNotHelpful = document.getElementById('btn-not-helpful');
    const helpfulCount = document.getElementById('helpful-count');
    const notHelpfulCount = document.getElementById('not-helpful-count');
    const reviewActionNote = document.getElementById('review-action-note');
    if (btnHelpful) btnHelpful.addEventListener('click', () => {
        helpfulCount.textContent = parseInt(helpfulCount.textContent) + 1;
        reviewActionNote.textContent = "Thanks for finding your own roast helpful. Bold move. 😎";
        btnHelpful.style.pointerEvents = 'none'; btnHelpful.style.opacity = '0.5';
    });
    if (btnNotHelpful) btnNotHelpful.addEventListener('click', () => {
        const c = parseInt(notHelpfulCount.textContent) + 1;
        notHelpfulCount.textContent = c;
        reviewActionNote.textContent = "Noted. You are now person #" + c + " who disagreed. The review remains unchanged. 🤷";
        btnNotHelpful.style.pointerEvents = 'none'; btnNotHelpful.style.opacity = '0.5';
    });
}

// ═══ 8. GHOST SECTION (PHASE 4 — FIXED) ═══
function initGhostSection() {
    const section = document.querySelector('.ghost-section');
    if (!section) return;
    const ghostTexts = document.querySelectorAll('.ghost-text');
    const realTexts = document.querySelectorAll('.real-text');
    const glitch1 = document.getElementById('glitch-text-1');
    const glitch2 = document.getElementById('glitch-text-2');
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const center = window.innerHeight / 2;
        let progress = (center - rect.top) / (rect.height - window.innerHeight * 0.5);
        progress = Math.max(0, Math.min(1, progress));
        ghostTexts.forEach(g => { g.style.opacity = progress; });
        realTexts.forEach(r => { r.style.opacity = 1 - progress * 0.4; });
        if (glitch1) glitch1.style.opacity = progress > 0.85 && progress <= 0.95 ? 1 : 0;
        if (glitch2) glitch2.style.opacity = progress > 0.95 ? 1 : 0;
    });
}

// ═══ 9. ENDING SEQUENCE & CONFETTI (PHASE 5) ═══
function initEndingSequence() {
    const section = document.getElementById('ending');
    const lines = document.querySelectorAll('.end-line');
    const endAction = document.querySelector('.end-action');
    const btnFairEnough = document.getElementById('btn-fair-enough');
    const endCredits = document.getElementById('end-credits');
    const delays = [0, 1500, 2500, 3500, 4300, 5100, 5900, 7100, 8100, 9300, 10300];
    let triggered = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !triggered) {
            triggered = true;
            lines.forEach((line, i) => { setTimeout(() => { line.classList.add('visible'); try { SoundFX.typewriter(); } catch(e) {} }, delays[i]); });
            setTimeout(() => endAction.classList.add('visible'), delays[10]);
            // Collapse sequence: 2s after line-10 appears
            const triggerCollapse = initCollapseSequence();
            setTimeout(triggerCollapse, delays[9] + 2000);
        }
    }, { threshold: 0.4 });
    if (section) observer.observe(section);
    if (btnFairEnough) {
        btnFairEnough.addEventListener('click', () => {
            btnFairEnough.textContent = "Now go build something real. 🚀";
            btnFairEnough.disabled = true;
            endCredits.classList.add('visible');
            document.querySelector('.ending-section').classList.add('celebrating');
            try { SoundFX.tada(); } catch(e) {}
            fireConfetti();
        });
    }
}
function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ['#6c63ff', '#00d4aa', '#ff4444', '#ffffff', '#ffb800', '#8b5cf6', '#ff6b9d'];
    const particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({ x: Math.random() * canvas.width, y: canvas.height + 20, r: Math.random() * 5 + 2, dx: Math.random() * 20 - 10, dy: Math.random() * -35 - 15, color: colors[Math.floor(Math.random() * colors.length)], tilt: Math.random() * 10, rotation: Math.random() * Math.PI * 2, rotationSpeed: Math.random() * 0.2 - 0.1 });
    }
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        particles.forEach(p => {
            p.dy += 0.4; p.dx *= 0.99; p.x += p.dx; p.y += p.dy; p.rotation += p.rotationSpeed;
            if (p.y < canvas.height + 40) {
                active = true;
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
                ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
            }
        });
        if (active) requestAnimationFrame(render); else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    render();
}

// ═══ 10. TOAST & EASTER EGGS ═══
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
function initEasterEggs() {
    document.querySelectorAll('.fake-link').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); showToast("This page doesn't exist yet. Very on brand. 🎭"); });
    });
    const moneyBtn = document.getElementById('btn-money-back');
    if (moneyBtn) moneyBtn.addEventListener('click', () => { showToast("You'd need to pay us first. Which you haven't. So... congrats, you're already refunded! 💸"); });
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let ki = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konami[ki]) { ki++; if (ki === konami.length) { showToast("You found the cheat code. Unfortunately, this app has no cheats. Or features. Respect. 🎮"); ki = 0; } } else ki = 0;
    });
    let idleTimer;
    function resetIdle() { clearTimeout(idleTimer); idleTimer = setTimeout(() => { showToast("Still there? Our AI is also procrastinating. You two would get along. 😴"); }, 45000); }
    ['mousemove','keypress','scroll','click','touchstart'].forEach(e => document.addEventListener(e, resetIdle, true));
    resetIdle();
    document.querySelectorAll('.nav-logo, .logo').forEach(el => {
        el.addEventListener('click', (e) => { if (e.detail === 3) showToast("You clicked the logo three times. Classic. Our lead designer also does this. 🖱️"); });
    });
}

// ═══════════════════════════════════
// NEW FEATURES
// ═══════════════════════════════════

// ═══ FEATURE 1: NOTIFICATION BELL ═══
function initNotificationBell() {
    const bell = document.getElementById('notif-bell');
    const dropdown = document.getElementById('notif-dropdown');
    const badgeEl = document.getElementById('notif-badge');
    const listEl = document.getElementById('notif-list');
    const markRead = document.getElementById('notif-mark-read');
    const notifications = [
        { id: 1, text: "Kevin liked your productivity score", time: "2 mins ago", read: false },
        { id: 2, text: "Your excuse database is 94% full", time: "1 hr ago", read: false },
        { id: 3, text: "You have 0 tasks completed. The tasks are aware.", time: "Just now", read: false }
    ];
    function render() {
        listEl.innerHTML = '';
        notifications.forEach(n => {
            const div = document.createElement('div');
            div.className = 'notif-item' + (n.read ? '' : ' notif-unread');
            div.innerHTML = n.text + '<div class="notif-time">' + n.time + '</div>';
            div.addEventListener('click', () => {
                if (!n.read) { n.read = true; updateBadge(); render(); }
                try { SoundFX.pop(); } catch(e) {}
                showToast("This notification has been marked as read. The notification disagrees. 🔔");
            });
            listEl.appendChild(div);
        });
    }
    function updateBadge() {
        const unread = notifications.filter(n => !n.read).length;
        badgeEl.textContent = unread;
        if (unread === 0) badgeEl.classList.add('hide'); else badgeEl.classList.remove('hide');
    }
    render();
    bell.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('hidden'); try { SoundFX.ding(); } catch(e2) {} });
    document.addEventListener('click', (e) => { if (!dropdown.contains(e.target) && e.target !== bell) dropdown.classList.add('hidden'); });
    markRead.addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        updateBadge(); render(); try { SoundFX.whoosh(); } catch(e) {}
        showToast("All notifications marked as read. They remain emotionally unresolved. 💔");
    });
}

// ═══ FEATURE 2: LIVE ACTIVITY FEED ═══
function initActivityFeed() {
    const feed = document.getElementById('activity-feed');
    const textEl = document.getElementById('activity-text');
    if (!feed || !textEl) return;
    const activityMessages = [
        "Someone from Kerala just questioned their life choices 🤔",
        "47 people are procrastinating on this page right now",
        "Priya just gave 4 stars again. We still don't talk about Priya.",
        "Kevin updated his LinkedIn. Again. 💼",
        "A user spent 4 minutes reading the fine print. We're worried.",
        "Someone tried to contact sales. Kevin didn't pick up.",
        "3 people are currently arguing with our AI chatbot.",
        "Anonymous user tried the money back guarantee. Twice.",
        "Someone read the pricing page 6 times and still chose Free.",
        "Kevin just promoted himself to Senior Kevin. 🎉",
        "A user bookmarked this page. The bookmark will never be opened.",
        "Someone hovered over the Enterprise plan for 40 seconds.",
        "Our uptime monitor just checked our uptime. It's fine. Probably.",
        "Kevin is in a meeting. The meeting is about Kevin.",
        "A user typed 'hello' to the AI. The AI related deeply."
    ];
    let pool = [...activityMessages];
    let shown = 0;
    function getNext() {
        if (pool.length === 0) pool = [...activityMessages];
        const i = Math.floor(Math.random() * pool.length);
        return pool.splice(i, 1)[0];
    }
    function showNext() {
        if (shown >= 8) { feed.classList.remove('show'); return; }
        textEl.classList.add('fade');
        setTimeout(() => { textEl.textContent = getNext(); textEl.classList.remove('fade'); shown++; }, 400);
    }
    setTimeout(() => { textEl.textContent = getNext(); shown++; feed.classList.add('show'); }, 3000);
    setInterval(() => { if (shown < 8 && feed.classList.contains('show')) showNext(); }, 8000);
}

// ═══ FEATURE 4: A/B TEST BANNER ═══
function initABBanner() {
    const banner = document.getElementById('ab-banner');
    const dismiss = document.getElementById('ab-dismiss');
    const navbar = document.getElementById('navbar');
    if (!banner || !dismiss) return;
    function applyOffset() {
        const h = banner.offsetHeight;
        document.body.style.paddingTop = h + 'px';
        navbar.style.top = h + 'px';
    }
    applyOffset();
    window.addEventListener('resize', () => { if (!banner.classList.contains('dismissed')) applyOffset(); });
    dismiss.addEventListener('click', () => {
        banner.classList.add('dismissed');
        document.body.style.paddingTop = '0';
        navbar.style.top = '0';
        try { SoundFX.whoosh(); } catch(e) {}
    });
}

// ═══ FEATURE 5: PRICE THAT CHANGES ═══
function initPriceChange() {
    const priceEl = document.getElementById('pro-price-display');
    if (!priceEl) return;
    const proPrices = [499, 489, 512, 479, 523, 499, 505, 488, 499];
    let proPriceIdx = 0;
    let wasInView = true;
    let pricingSoundPlayed = false;
    const pricingSection = document.getElementById('pricing');
    if (!pricingSection) return;
    const observer = new IntersectionObserver((entries) => {
        const isIntersecting = entries[0].isIntersecting;
        if (!isIntersecting && wasInView) {
            proPriceIdx = (proPriceIdx + 1) % proPrices.length;
            wasInView = false;
        }
        if (isIntersecting && !wasInView) {
            wasInView = true;
            const newPrice = proPrices[proPriceIdx];
            priceEl.innerHTML = '₹' + newPrice + '<span>/month</span>';
            priceEl.classList.add('flashing');
            priceEl.addEventListener('animationend', () => priceEl.classList.remove('flashing'), { once: true });
            try { SoundFX.cash(); } catch(e) {}
        }
        if (isIntersecting && !pricingSoundPlayed) {
            pricingSoundPlayed = true;
            try { SoundFX.cash(); } catch(e) {}
        }
    }, { threshold: 0.1 });
    observer.observe(pricingSection);
    priceEl.addEventListener('click', () => { showToast("It does that. We've tried fixing it. Kevin says it's a feature. 🤷"); });
}

// ═══ FEATURE 6: CONTACT SALES MODAL ═══
function initSalesModal() {
    const modal = document.getElementById('sales-modal');
    const closeBtn = document.getElementById('sales-modal-close');
    const contactBtn = document.getElementById('btn-contact-sales');
    const step1 = document.getElementById('sales-step-1');
    const step2 = document.getElementById('sales-step-2');
    const step3 = document.getElementById('sales-step-3');
    const step4 = document.getElementById('sales-step-4');
    const holdBar = document.getElementById('hold-bar');
    const holdStatus = document.getElementById('hold-status');
    const callerNumber = document.getElementById('caller-number');
    const btnLeaveVibe = document.getElementById('btn-leave-vibe');
    const btnSendVibe = document.getElementById('btn-send-vibe');
    const btnSalesDone = document.getElementById('btn-sales-done');
    const vibeClass = document.getElementById('vibe-classification');
    if (!modal || !contactBtn) return;
    const allSteps = [step1, step2, step3, step4];
    const holdMessages = [
        "Establishing connection...", "Finding someone who answers phones...", "Locating Kevin...",
        "Kevin is unavailable...", "Trying Kevin's backup...", "The backup is also Kevin...",
        "Connection established. Redirecting to hold music."
    ];
    const vibeClassifications = [
        "Enthusiastic but suspicious 🤔", "Cautiously optimistic with trust issues 😅",
        "Premium energy, budget unclear 💸", "Definitely googled us before this 🔍",
        "Ready to commit but needs 3 more meetings 📅", "Strong Kevin energy. Worrying. 😬"
    ];
    function showSalesStep(step) { allSteps.forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); }); step.classList.remove('hidden'); step.classList.add('active'); }
    contactBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        try { SoundFX.whoosh(); } catch(e) {}
        showSalesStep(step1);
        let msgIdx = 0;
        holdBar.style.width = '0%'; holdBar.style.transition = 'none';
        const totalDuration = 4000, msgInterval = totalDuration / holdMessages.length;
        setTimeout(() => { holdBar.style.transition = 'width ' + totalDuration + 'ms linear'; holdBar.style.width = '100%'; }, 50);
        const msgTimer = setInterval(() => {
            if (msgIdx < holdMessages.length) { holdStatus.textContent = holdMessages[msgIdx]; msgIdx++; }
            else { clearInterval(msgTimer); setTimeout(() => { callerNumber.textContent = Math.floor(Math.random() * 847) + 1; showSalesStep(step2); }, 400); }
        }, msgInterval);
    });
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    btnLeaveVibe.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} showSalesStep(step3); });
    btnSendVibe.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} vibeClass.textContent = vibeClassifications[Math.floor(Math.random() * vibeClassifications.length)]; showSalesStep(step4); });
    btnSalesDone.addEventListener('click', () => { try { SoundFX.error(); } catch(e) {} modal.classList.add('hidden'); showToast("Kevin has been notified. Kevin sends his regards. Kevin does not know what regards are. 🫡"); });
}

// ═══ FEATURE 7: PRODUCTIVITY QUIZ ═══
function initQuiz() {
    const views = { intro: document.getElementById('quiz-intro'), q1: document.getElementById('quiz-q1'), q2: document.getElementById('quiz-q2'), q3: document.getElementById('quiz-q3'), result: document.getElementById('quiz-result') };
    function showQuizView(key) {
        Object.values(views).forEach(v => { if (v) { v.classList.remove('active'); v.classList.add('hidden'); } });
        if (views[key]) { views[key].classList.remove('hidden'); views[key].classList.add('active'); }
    }
    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) startBtn.addEventListener('click', () => showQuizView('q1'));
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} showQuizView(btn.getAttribute('data-next')); });
    });
    // phaaa on quiz result reveal
    function showQuizViewOrig(key) {
        Object.values(views).forEach(v => { if (v) { v.classList.remove('active'); v.classList.add('hidden'); } });
        if (views[key]) { views[key].classList.remove('hidden'); views[key].classList.add('active'); }
        if (key === 'result') setTimeout(() => { try { SoundFX.phaaa(); } catch(e) {} }, 500);
    }
    // Re-bind quiz options to use updated showQuizView with phaaa
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.onclick = () => { try { SoundFX.pop(); } catch(e) {} showQuizViewOrig(btn.getAttribute('data-next')); };
    });
    const acceptBtn = document.getElementById('btn-accept-kevin');
    const denyBtn = document.getElementById('btn-deny-kevin');
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        try { SoundFX.tada(); } catch(e) {}
        showToast("Kevin has been notified of your acceptance. Kevin is honored. Kevin is still in a meeting. 🙏");
        acceptBtn.textContent = "Welcome to the team, Kevin. 🎉"; acceptBtn.disabled = true;
    });
    if (denyBtn) denyBtn.addEventListener('click', () => {
        try { SoundFX.error(); } catch(e) {}
        denyBtn.textContent = "You are Kevin. 🫵"; denyBtn.disabled = true;
        setTimeout(() => showToast("Denial noted. Added to your permanent record. Kevin also denied being Kevin. Initially. 😶"), 500);
    });
}

// ═══ FEATURE 8: FAKE APP DOWNLOAD ═══
function initAppSection() {
    const appStoreBtn = document.getElementById('btn-app-store');
    const playStoreBtn = document.getElementById('btn-play-store');
    const submitBtn = document.getElementById('btn-waitlist-submit');
    const emailInput = document.getElementById('waitlist-email');
    const waitlistLabel = document.getElementById('waitlist-label');
    const waitlistFine = document.getElementById('waitlist-fine');
    function showAppToast() { try { SoundFX.error(); } catch(e) {} showToast("Our app is in stealth mode. (It doesn't exist yet. The stealth is involuntary.) 👻"); }
    if (appStoreBtn) appStoreBtn.addEventListener('click', showAppToast);
    if (playStoreBtn) playStoreBtn.addEventListener('click', showAppToast);
    if (submitBtn) submitBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const position = Math.floor(Math.random() * 8000) + 500;
        if (!email || !email.includes('@')) { try { SoundFX.error(); } catch(e) {} showToast("That doesn't look like an email. Our AI noticed. It judges. 👀"); return; }
        try { SoundFX.ding(); } catch(e) {}
        waitlistLabel.textContent = "You're on the waitlist!";
        waitlistLabel.style.color = 'var(--secondary)';
        waitlistFine.innerHTML = "You are number <strong>" + position + "</strong> on the list. Kevin is number 1. Kevin put himself there. 🏆";
        emailInput.style.display = 'none'; submitBtn.style.display = 'none';
        setTimeout(() => showToast("Waitlist position " + position + " confirmed. Kevin says hi. Kevin doesn't know you. Yet. 👋"), 500);
    });
}

// ═══ FEATURE 9: EXPORT REPORT (PDF) ═══
function initExportReport() {
    const btn = document.getElementById('btn-export-report');
    if (!btn) return;
    const toastMessages = ["Preparing your report... 📊", "Compiling 0 data points...", "Adding charts (the bars are decorative)...", "Asking Kevin to approve... Kevin approved.", "Report ready! Opening PDF... 📥"];
    btn.addEventListener('click', () => {
        btn.disabled = true; btn.textContent = '⏳ Generating...';
        let i = 0;
        const sequence = setInterval(() => {
            if (i < toastMessages.length) { showToast(toastMessages[i]); try { SoundFX.typewriter(); } catch(e) {} i++; }
            else {
                clearInterval(sequence);
                const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
                const reportId = 'LEGIT-' + Math.floor(Math.random()*99999);
                const pdfHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LEGIT.ai Productivity Report</title><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#0a0a0f;color:#ffffff;padding:40px;line-height:1.7}
@media print{body{background:#0a0a0f;-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{size:A4;margin:20mm}}
.report{max-width:700px;margin:0 auto;background:#13131a;border:1px solid #1e1e2e;border-radius:16px;padding:48px;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.logo{font-size:32px;font-weight:700;text-align:center;margin-bottom:4px;letter-spacing:2px}.logo .dot{color:#6c63ff}
.tagline{text-align:center;font-size:11px;color:#888899;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px}
.title{text-align:center;font-size:24px;font-weight:700;color:#6c63ff;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #1e1e2e}
.meta{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:32px;font-size:13px;color:#888899}
.meta span{background:#0f0f18;padding:6px 14px;border-radius:8px;border:1px solid #1e1e2e}
.section-header{font-size:14px;font-weight:700;color:#00d4aa;text-transform:uppercase;letter-spacing:1.5px;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #1e1e2e}
.metrics{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px}
.metric{background:#0f0f18;border:1px solid #1e1e2e;border-radius:10px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center}
.metric-label{font-size:13px;color:#888899}.metric-value{font-size:13px;font-weight:700;color:#ffffff}
.highlight{color:#6c63ff}
p{font-size:14px;color:#ccccdd;margin-bottom:12px}
.analysis-box{background:linear-gradient(135deg,rgba(108,99,255,0.08),rgba(0,212,170,0.05));border:1px solid rgba(108,99,255,0.2);border-radius:12px;padding:24px;text-align:center;margin:16px 0}
.analysis-box .big{font-size:22px;font-weight:700;color:#ffffff;margin:12px 0}
.analysis-box .sub{font-size:13px;color:#888899}
ol{margin:0 0 16px 20px;font-size:14px;color:#ccccdd}ol li{margin-bottom:10px}
.conclusion{text-align:center;margin-top:24px;padding-top:24px;border-top:1px solid #1e1e2e}
.conclusion .pct{font-size:28px;font-weight:700;color:#00d4aa;margin:8px 0}
.footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #1e1e2e;font-size:11px;color:#555566;line-height:1.8}
.stars{color:#ffb800;letter-spacing:2px}
.badge{display:inline-block;background:linear-gradient(135deg,#6c63ff,#8b5cf6);color:#fff;padding:4px 14px;border-radius:12px;font-size:11px;font-weight:700;margin-left:8px}
.print-btn{display:block;margin:24px auto 0;background:linear-gradient(135deg,#6c63ff,#8b5cf6);color:#fff;border:none;padding:14px 40px;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit}
.print-btn:hover{opacity:0.9;transform:scale(1.02)}
@media print{.print-btn{display:none}}
</style></head><body>
<div class="report">
<div class="logo">LEGIT<span class="dot">.</span>ai</div>
<div class="tagline">Absolutely Improvised Intelligence&trade;</div>
<div class="title">Productivity Report</div>
<div class="meta">
<span>📅 ${today}</span>
<span>🆔 ${reportId}</span>
<span>👤 You <span class="stars">★★★☆☆</span></span>
<span>✍️ Prepared by: Kevin<span class="badge">Approved</span></span>
</div>

<div class="section-header">📊 Executive Summary</div>
<div class="metrics">
<div class="metric"><span class="metric-label">Tasks Completed</span><span class="metric-value">Unknown</span></div>
<div class="metric"><span class="metric-label">Tasks Attempted</span><span class="metric-value">Probably some</span></div>
<div class="metric"><span class="metric-label">Tasks Pending</span><span class="metric-value">Yes</span></div>
<div class="metric"><span class="metric-label">Coffees Consumed</span><span class="metric-value">Too many</span></div>
<div class="metric"><span class="metric-label">Excuses Generated</span><span class="metric-value">Impressive</span></div>
<div class="metric"><span class="metric-label">Tabs Open</span><span class="metric-value">Lost count</span></div>
<div class="metric"><span class="metric-label">Meetings Attended</span><span class="metric-value">Could've been emails</span></div>
<div class="metric"><span class="metric-label">Productivity Score</span><span class="metric-value highlight">Vibes-based (±∞)</span></div>
</div>

<div class="section-header">🧠 AI Analysis</div>
<p>After extensive analysis of your session data (we don't actually collect session data), our proprietary algorithm has determined:</p>
<div class="analysis-box">
<div class="sub">Overall Assessment</div>
<div class="big">You are doing fine.</div>
<div class="sub">Not great. Not terrible. Fine.<br>Statistically indistinguishable from Kevin.</div>
</div>

<div class="section-header">💡 Recommendations</div>
<ol>
<li>Close some tabs. Not all of them. Just some.</li>
<li>The task you've been avoiding? Still there.</li>
<li>Take a break. You read a fake report. That's already more than most people do.</li>
<li>Consider telling Kevin he's doing a good job. Kevin doesn't hear that enough.</li>
</ol>

<div class="section-header">🏁 Conclusion</div>
<div class="conclusion">
<p>You opened this report.</p>
<div class="pct">Top 12%</div>
<p>That already puts you ahead of most people.</p>
<p style="margin-top:16px;color:#00d4aa;font-weight:700">Keep going. We believe in you. Probably.</p>
</div>

<div class="footer">
LEGIT.ai &copy; 2026 &mdash; Nothing here is trademarked. We checked.<br>
Kevin approved this report at 11pm. Kevin had questions. We ignored them.<br>
This document is certified 100% vibes-based. Do not cite in court.
</div>
</div>
<button class="print-btn" onclick="window.print()">📥 Save as PDF</button>
</body></html>`;
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(pdfHTML);
                    printWindow.document.close();
                }
                btn.disabled = false; btn.textContent = '📄 Export Report';
                try { SoundFX.tada(); } catch(e) {}
                showToast("Report generated. Use 'Save as PDF' in the print dialog. Kevin stands by its contents. 📋");
            }
        }, 1000);
    });
}

// ═══ COLLAPSE SEQUENCE ═══
function initCollapseSequence() {
    let collapseTriggered = false;
    return function triggerCollapse() {
        if (collapseTriggered) return;
        collapseTriggered = true;
        document.body.classList.add('collapsing');
        try { SoundFX.collapse(); } catch(e) {}
        const targets = [
            ...document.querySelectorAll('.navbar, .ab-banner, .hero-section, .features-section, .fun-section, .quiz-section, .social-proof-section, .pricing-section, .app-section, .ghost-section, footer')
        ].filter(el => el && el.id !== 'ending');
        setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            targets.forEach(el => {
                const delay = Math.random() * 800;
                const rotation = (Math.random() * 60 - 30) * (isMobile ? 0.5 : 1);
                setTimeout(() => {
                    el.style.transition = 'transform 2s cubic-bezier(0.25,0.46,0.45,0.94), opacity 1.5s ease';
                    el.style.transformOrigin = Math.random() > 0.5 ? 'top left' : 'top right';
                    el.style.transform = 'translateY(' + (window.innerHeight * 1.5) + 'px) rotate(' + rotation + 'deg)';
                    el.style.opacity = '0';
                }, delay);
            });
            const debrisCount = isMobile ? 15 : 30;
            const colors = ['#6c63ff','#00d4aa','#ff4444','#ffffff','#ffb800'];
            for (let d = 0; d < debrisCount; d++) {
                setTimeout(() => {
                    const p = document.createElement('div');
                    const size = 4 + Math.random() * 12;
                    const dur = 1000 + Math.random() * 1500;
                    p.classList.add('debris-particle');
                    p.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(Math.random()*100)+'%;top:'+(-50+Math.random()*250)+'px;background:'+colors[Math.floor(Math.random()*colors.length)]+';border-radius:'+Math.random()*4+'px;transition:transform '+dur+'ms ease-in, opacity 0.5s ease '+(dur-500)+'ms;';
                    document.body.appendChild(p);
                    setTimeout(() => { p.style.transform = 'translateY('+(window.innerHeight+200)+'px) rotate('+(180+Math.random()*540)+'deg)'; p.style.opacity = '0'; }, 50);
                    setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, dur + 600);
                }, 500 + Math.random() * 800);
            }
        }, 200);
        setTimeout(() => {
            const fs = document.createElement('div');
            fs.style.cssText = 'position:fixed;inset:0;background:#0a0a0f;z-index:9500;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity 1s ease;';
            fs.innerHTML = '<div style="text-align:center;padding:40px 20px"><div style="font-size:64px;margin-bottom:24px">🏚️</div><h1 style="font-size:clamp(24px,5vw,48px);font-weight:700;color:#ffffff;margin-bottom:16px">Well. That happened.</h1><p style="font-size:clamp(14px,2vw,18px);color:#888899;margin-bottom:8px">The website has experienced what engineers call</p><p style="font-size:clamp(18px,3vw,28px);color:#6c63ff;font-weight:700;margin-bottom:24px">"a totally planned structural event."</p><p style="font-size:clamp(12px,1.5vw,14px);color:#888899;margin-bottom:32px">Kevin has been notified. Kevin is also falling.</p><button id="btn-rebuild" style="background:#6c63ff;color:#ffffff;border:none;padding:14px 28px;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit;min-height:44px">🔨 Rebuild Everything</button><p style="font-size:11px;color:#888899;margin-top:12px">(This will reload the page. Kevin cannot be rebuilt.)</p></div>';
            document.body.appendChild(fs);
            setTimeout(() => { fs.style.opacity = '1'; }, 100);
            const rb = document.getElementById('btn-rebuild');
            if (rb) rb.addEventListener('click', () => { try { SoundFX.tada(); } catch(e) {} setTimeout(() => window.location.reload(), 500); });
        }, 3000);
    };
}

// ═══ SOUND BINDINGS ═══
function initSoundBindings() {
    document.querySelectorAll('.btn-fun').forEach(btn => {
        btn.addEventListener('click', () => { try { SoundFX.pop(); } catch(e) {} });
    });
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initNavbar();
    initScrollAnimations();
    initChatBox();
    initModal();
    initGhostSection();
    initEndingSequence();
    initEasterEggs();
    // New features
    initNotificationBell();
    initActivityFeed();
    initABBanner();
    initPriceChange();
    initSalesModal();
    initQuiz();
    initAppSection();
    initExportReport();
    initSoundBindings();
});
