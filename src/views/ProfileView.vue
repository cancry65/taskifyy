<template>
  <section class="profile-view">
    <!-- Header / Bio Section -->
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-box">CY</div>
        <div class="profile-info">
          <div class="badge">DEVELOPER & CREATIVE DESIGNER</div>
          <h1 class="profile-name">CANCRIE65 / CANCRY</h1>
          <p class="profile-bio">
            Passionate Frontend Developer focused on building high-energy Neo-Brutalist web applications, interactive UIs, and playful web experiences.
          </p>
        </div>
      </div>
      <div class="profile-socials">
        <a href="https://github.com/cancry65" target="_blank" class="btn-brutal primary">GITHUB ↗</a>
        <a href="https://linkedin.com" target="_blank" class="btn-brutal secondary">LINKEDIN ↗</a>
        <a href="mailto:cancry@gmail.com" class="btn-brutal secondary">EMAIL ME: cancry@gmail.com ✉</a>
      </div>
    </div>

    <!-- Circle / Connections Section (Teman Dekat) -->
    <div class="section-title">
      <h2>INNER CIRCLE & COLLABORATORS</h2>
    </div>
    <div class="circle-grid">
      <div class="circle-card">
        <div class="circle-tag">TEMAN DEKAT 🤝</div>
        <h3>FLESSAN (THIO SAPUTRA)</h3>
        <p>Web Developer & Automation Engineer. Partner kolaborasi dan kawan dekat dalam pengembangan projek web & otomasi.</p>
        <a href="https://github.com/flessan" target="_blank" class="btn-brutal primary btn-small">
          VISIT FLESSAN'S GITHUB ↗
        </a>
      </div>
    </div>

    <!-- Skills Section -->
    <div class="section-title margin-top">
      <h2>TECH STACK & SKILLS</h2>
    </div>
    <div class="skills-grid">
      <div class="skill-card">
        <h3>FRONTEND</h3>
        <p>Vue.js, Vite, JavaScript (ES6+), HTML5/CSS3, TailwindCSS</p>
      </div>
      <div class="skill-card highlighted">
        <h3>UI/UX & STYLING</h3>
        <p>Neo-Brutalism, Responsive Design, CSS Variables, Animations</p>
      </div>
      <div class="skill-card">
        <h3>TOOLS & UTILS</h3>
        <p>Git, VS Code, Canvas API, Physics Engine / Matter.js</p>
      </div>
    </div>

    <!-- Featured Projects Section -->
    <div class="section-title margin-top">
      <h2>FEATURED PROJECTS</h2>
    </div>
    <div class="projects-grid">
      <div class="project-card">
        <div class="project-tag">PROJECT 01</div>
        <h3>BRUTAL.SYS DASHBOARD</h3>
        <p>Interactive neo-brutalist dashboard featuring theme switching, interactive calendar, and physics-based sticker gravity.</p>
      </div>
      <div class="project-card">
        <div class="project-tag">PROJECT 02</div>
        <h3>RETRO ARCADE LAB</h3>
        <p>Classic arcade mini-games built with Vue 3 & HTML5 Canvas, perfectly synced with dynamic system themes.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// ProfileView menggunakan CSS variables global sehingga otomatis mengikuti tema
</script>

<style scoped>
/* Card Profil Utama */
.profile-card {
  border: 4px solid var(--border-color);
  padding: 2.5rem;
  box-shadow: 8px 8px 0px var(--shadow-color);
  background: var(--bg-card);
  margin-bottom: 2rem;
}

.profile-header {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.avatar-box {
  width: 100px;
  height: 100px;
  background: var(--accent-primary);
  color: var(--accent-text);
  font-size: 2.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--border-color);
  box-shadow: 4px 4px 0px var(--shadow-color);
}

.profile-info {
  flex: 1;
}

.badge {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--accent-text);
  padding: 0.25rem 0.75rem;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.profile-bio {
  font-size: 1.1rem;
  color: var(--text-main);
  max-width: 650px;
}

.profile-socials {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Button Brutalism */
.btn-brutal {
  border: 3px solid var(--border-color);
  padding: 0.6rem 1.2rem;
  font-family: 'Space Mono', monospace;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 4px 4px 0px var(--shadow-color);
  font-size: 0.9rem;
  display: inline-block;
}

.btn-brutal.primary {
  background: var(--accent-primary);
  color: var(--accent-text);
}

.btn-brutal.secondary {
  background: var(--bg-card);
  color: var(--text-main);
}

.btn-small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  margin-top: 0.75rem;
}

/* Section Title */
.section-title {
  border-left: 8px solid var(--accent-primary);
  padding-left: 1rem;
  margin-bottom: 1.5rem;
}

.section-title h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
}

.margin-top {
  margin-top: 3rem;
}

/* Grids */
.skills-grid, .projects-grid, .circle-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.skill-card, .project-card, .circle-card {
  border: 4px solid var(--border-color);
  padding: 1.5rem;
  box-shadow: 6px 6px 0px var(--shadow-color);
  background: var(--bg-card);
  color: var(--text-main);
}

.skill-card.highlighted {
  background: var(--accent-primary);
  color: var(--accent-text);
}

.skill-card h3, .project-card h3, .circle-card h3 {
  font-weight: 800;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.project-tag, .circle-tag {
  display: inline-block;
  background: var(--accent-primary);
  color: var(--accent-text);
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  margin-bottom: 0.75rem;
}
</style>