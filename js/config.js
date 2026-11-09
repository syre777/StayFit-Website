/* ==========================================================================
   StayFit — configuração do site
   Edita ESTE ficheiro para atualizar versão, requisitos e textos.
   Não é preciso mexer em mais nada.
   ========================================================================== */
window.STAYFIT_CONFIG = {
  appName: "StayFit",

  // ---- Versão e ficheiro APK ------------------------------------------------
  version: "1.0",                         // versão da app (ex.: "1.1.0")
  releaseDate: "",                        // ex.: "Novembro de 2026" (deixa vazio para ocultar)
  apkPath: "assets/downloads/StayFit.apk",// coloca o teu APK exatamente aqui
  apkDownloadName: "StayFit.apk",         // nome que o ficheiro terá ao ser descarregado

  // ---- Requisitos mínimos (aparecem na página de download) -----------------
  requirements: [
    { label: "Sistema operativo", value: "Indicado em breve" },
    { label: "Espaço livre", value: "Indicado em breve" },
    { label: "Instalação", value: "Permitir instalar apps de fontes desconhecidas" }
  ],

  // ---- Textos que dependem de informação ainda não confirmada --------------
  texts: {
    free: "As condições de preço e de utilização da StayFit serão indicadas aqui em breve.",
    account: "A informação sobre a criação de conta na aplicação será indicada aqui em breve.",
    points: "Os pontos são ganhos ao completar desafios e podem ser trocados por personalizações visuais na loja de recompensas. Os detalhes do sistema de pontos serão publicados em breve."
  }
};
