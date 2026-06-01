/* 
 ==========================================================================
 LUMINA ESTUDOS - INTERATIVIDADE, ANIMAÇÕES E INTERSECTIONS (animation.js)
 ==========================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
  
  // Ativa a ocultação de animação somente após o script carregar e rodar com sucesso!
  document.documentElement.classList.add("js-enabled");
  
  /* ------------------------------------------------------------------------
     1. SISTEMA DE REVELAÇÃO SUAVE E BIDIRECIONAL AO ROLAR (SCROLL REVEAL)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          // Remove a classe ao sair da tela (efeito bidirecional de retorno!)
          entry.target.classList.remove("visible");
        }
      });
    }, {
      root: null,
      rootMargin: "-20px 0px -40px 0px", // Margens leves para suavizar a saída/entrada
      threshold: 0.05
    });
    
    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("visible");
    });
  }

  /* ------------------------------------------------------------------------
     2. CHECADOR DINÂMICO DE CARREGAMENTO DE PRINTS (IMAGE LAZYLOAD & FALLBACK)
     ------------------------------------------------------------------------ */
  const screenshots = document.querySelectorAll(".screenshot-wrapper img");
  
  screenshots.forEach(img => {
    // Se a imagem já estiver em cache/carregada
    if (img.complete && img.naturalWidth > 0) {
      img.closest(".screenshot-wrapper").classList.add("loaded");
    }
    
    img.addEventListener("load", () => {
      img.closest(".screenshot-wrapper").classList.add("loaded");
    });
    
    img.addEventListener("error", () => {
      // Se der erro ao carregar (imagem não existe ainda), garantimos que o wrapper saiba
      img.closest(".screenshot-wrapper").classList.remove("loaded");
      // Ocultamos a tag img quebrada para não mostrar ícone padrão de erro de imagem do browser
      img.style.display = "none";
    });
  });

  /* ------------------------------------------------------------------------
     3. BOTÕES DE COPIAR PROMPTS DE IA COM 1 CLIQUE
     ------------------------------------------------------------------------ */
  const copyButtons = document.querySelectorAll(".btn-copy");
  
  copyButtons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".prompt-card");
      const promptBody = card.querySelector(".prompt-body");
      
      if (promptBody) {
        const textToCopy = promptBody.textContent.trim();
        
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Feedback visual de cópia
          const originalHTML = button.innerHTML;
          button.classList.add("copied");
          button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg> Copiado!
          `;
          
          setTimeout(() => {
            button.classList.remove("copied");
            button.innerHTML = originalHTML;
          }, 2200);
        }).catch(err => {
          console.error("Erro ao copiar prompt: ", err);
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. LINK ATIVO AUTOMÁTICO DO SUMÁRIO (TUTORIAIS SIDEBAR NAV)
     ------------------------------------------------------------------------ */
  const tutorialNavLinks = document.querySelectorAll(".tutorial-nav a");
  const tutorialSections = document.querySelectorAll(".tutorial-section");
  
  if (tutorialNavLinks.length > 0 && tutorialSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute("id");
          
          tutorialNavLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${activeId}`) {
              link.classList.add("active");
              
              // Rolagem horizontal suave no menu mobile
              if (window.innerWidth <= 960) {
                link.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
              }
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: "-20% 0px -60% 0px" // Dispara quando a seção ocupa a maior parte do centro
    });
    
    tutorialSections.forEach(section => {
      sectionObserver.observe(section);
    });
  /* ------------------------------------------------------------------------
     5. ALTERNADOR DE MOCKUPS DO DASHBOARD (TABS NO PREVIEW)
     ------------------------------------------------------------------------ */
  const tabButtons = document.querySelectorAll(".tab-btn");
  
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;
      
      const parentContainer = btn.closest(".screenshot-container");
      const targetId = btn.getAttribute("data-target");
      
      parentContainer.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      parentContainer.querySelectorAll(".screenshot-wrapper").forEach(wrapper => {
        wrapper.style.transition = "opacity 0.2s ease";
        wrapper.style.opacity = "0";
        setTimeout(() => {
          wrapper.style.display = "none";
        }, 200);
      });
      
      setTimeout(() => {
        const targetWrapper = parentContainer.querySelector(`#${targetId}`);
        if (targetWrapper) {
          targetWrapper.style.display = "grid";
          targetWrapper.style.opacity = "0";
          targetWrapper.style.transition = "opacity 0.2s ease";
          setTimeout(() => {
            targetWrapper.style.opacity = "1";
          }, 30);
        }
      }, 210);
  });

  /* ------------------------------------------------------------------------
     6. MODAL LIGHTBOX PARA EXPANDIR E PROPORCIONAR ZOOM NOS PRINTS
     ------------------------------------------------------------------------ */
  const hasScreenshots = document.querySelector(".screenshot-wrapper img");
  
  if (hasScreenshots) {
    const lightboxOverlay = document.createElement("div");
    lightboxOverlay.className = "lightbox-overlay";
    lightboxOverlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Fechar visualização expandida">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Fechar
        </button>
        <img class="lightbox-image" src="" alt="Print Ampliado">
        <div class="lightbox-caption">Clique em qualquer lugar para fechar</div>
      </div>
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImg = lightboxOverlay.querySelector(".lightbox-image");

    document.addEventListener("click", (e) => {
      const img = e.target.closest(".screenshot-wrapper img");
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });

    const closeLightbox = () => {
      lightboxOverlay.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => {
        lightboxImg.src = "";
      }, 300);
    };

    lightboxOverlay.addEventListener("click", (e) => {
      if (e.target === lightboxOverlay || e.target.closest(".lightbox-close")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightboxOverlay.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

});
