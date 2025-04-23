
AOS.init(
  {
      duration: 1200,
  }
);

const larguraDaTela = window.innerWidth
  
if (larguraDaTela < 800) {
    var swiper3 = new Swiper(".mySwiper3", {
        grabCursor: true,
        effect: "creative",
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
          },
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
} else {
    var swiper3 = new Swiper(".mySwiper3", {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
}

// Seleciona os novos botões para abrir o modal
const openModalButtons = document.querySelectorAll('.openModalForm');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalButton = document.getElementById('closeModal');

// Variável para armazenar a origem do modal (WhatsApp, Obrigado ou Exit)
let redirectType = null;

// Função para abrir o modal e definir o tipo de redirecionamento
function openModal(event) {
    modalOverlay.classList.add('active');

    if (event && event.target.closest('.btn-whatsapp-pulse')) {
        redirectType = 'whatsapp';
    } else if (event) {
        redirectType = 'obrigado';
    } else {
        redirectType = 'exit-intent';
    }
}

// Função para fechar o modal
function closeModal() {
    modalOverlay.classList.remove('active');
    redirectType = null;
}

// Adiciona evento para abrir o modal nos botões
openModalButtons.forEach(button => {
    button.addEventListener('click', openModal);
});

// Evento para fechar ao clicar no botão de fechar
if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
}

// Evento para fechar ao clicar fora do modal (overlay)
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Exit Intent - Mostra o modal ao tentar sair do site
if (localStorage.getItem('modalShown') !== 'true') {
    document.addEventListener('mouseleave', function(event) {
        if (event.clientY <= 0) {
            localStorage.setItem('modalShown', 'true');
            openModal(); // abre o modal sem evento, como exit-intent
        }
    });
}

