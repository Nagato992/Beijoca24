// ============ MENU: MARCAS E SUBCATEGORIAS ============
// Edite à vontade. A ordem aqui é a ordem do menu.
const CATEGORIAS = {
  "Inuka":        ["Cuidados Faciais","Cuidados Corporais","Maquilhagem","Cabelos","Perfumes"],
  "Avon":         ["Cuidados Faciais","Cuidados Corporais","Maquilhagem","Cabelos","Perfumes"],
  "Villa":        ["Cuidados Faciais","Cuidados Corporais","Maquilhagem","Cabelos","Perfumes"],
  "Desodorantes": ["Femininos","Masculinos","Roll-on","Spray"],
  "Outras Marcas":["Cuidados Faciais","Cuidados Corporais","Maquilhagem","Cabelos","Perfumes","Unhas","Acessórios"]
};

// Categorias da barra lateral (filtram por subcategoria, em todas as marcas)
const LATERAL = ["Cuidados Faciais","Cuidados Corporais","Maquilhagem","Cabelos","Perfumes"];

// Banners das marcas (fundo, cor do botão, slogan). Imagem opcional: images/banners/<marca>.png
const BANNERS = {
  "Inuka":        {slogan:"Beleza Natural",       bg:"linear-gradient(135deg,#f8e6d2,#efd3b5)", cor:"#a8743a"},
  "Avon":         {slogan:"Beleza que inspira",   bg:"linear-gradient(135deg,#f9c3d8,#f08bb4)", cor:"#c2185b"},
  "Villa":        {slogan:"Cuidados que você ama",bg:"linear-gradient(135deg,#e6d4f7,#c9a8ee)", cor:"#7a3fc4"},
  "Desodorantes": {slogan:"Proteção o dia todo",  bg:"linear-gradient(135deg,#d8f0fb,#a9dcf5)", cor:"#1a8fc2"},
  "Outras Marcas":{slogan:"Mais opções para si",  bg:"linear-gradient(135deg,#f3dcf7,#e2b6ec)", cor:"#9b3bb0"}
};

// ============ PRODUTOS ============
// p(marca, subcategoria, nome, preço actual MT, preço antigo MT (ou 0), ficheiro da foto)
// Fotos em images/<pasta>/  (inuka, avon, villa, desodorantes, outras-marcas)
// ATENÇÃO: nomes e preços abaixo são EXEMPLOS — troque pelos reais.
const PASTA = m => m.toLowerCase().replace(/\s+/g, "-");
const p = (marca, sub, nome, preco, antigo, img) => ({
  id: (marca + sub + nome).toLowerCase().replace(/[^a-z0-9]/g, ""),
  marca, sub, nome, preco, antigo,
  img: `images/${PASTA(marca)}/${img}`
});

const PRODUTOS = [
  p("Inuka","Cuidados Corporais","Creme Hidratante INUKA",1200,1500,"creme-hidratante.jpg"),
  p("Inuka","Cuidados Faciais","Creme Facial INUKA",950,0,"creme-facial.jpg"),
  p("Inuka","Cabelos","Óleo de Cabelo INUKA",700,0,"oleo-cabelo.jpg"),
  p("Inuka","Perfumes","Perfume INUKA",1500,0,"perfume.jpg"),
  p("Avon","Cuidados Corporais","Loção Corporal AVON Soft Musk",1450,1700,"locao-soft-musk.jpg"),
  p("Avon","Maquilhagem","Batom AVON",600,0,"batom.jpg"),
  p("Avon","Perfumes","Perfume AVON",2200,0,"perfume.jpg"),
  p("Avon","Cuidados Faciais","Creme Facial AVON Anew",1800,0,"anew.jpg"),
  p("Villa","Perfumes","Perfume VILLA Essence",2000,2350,"perfume-essence.jpg"),
  p("Villa","Cuidados Corporais","Loção VILLA",1100,0,"locao.jpg"),
  p("Villa","Cabelos","Shampoo VILLA",800,0,"shampoo.jpg"),
  p("Desodorantes","Femininos","Desodorante Rexona Feminino",350,390,"rexona-feminino.jpg"),
  p("Desodorantes","Masculinos","Desodorante Masculino",350,0,"masculino.jpg"),
  p("Desodorantes","Roll-on","Desodorante Roll-on",300,0,"rollon.jpg"),
  p("Desodorantes","Spray","Desodorante Spray",380,0,"spray.jpg"),
  p("Outras Marcas","Maquilhagem","Base Líquida",900,0,"base.jpg"),
  p("Outras Marcas","Unhas","Verniz de Unhas",150,0,"verniz.jpg"),
  p("Outras Marcas","Acessórios","Espelho de Bolso",120,0,"espelho.jpg"),
];
