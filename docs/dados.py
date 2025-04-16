from fpdf import FPDF


class StyledPDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 14)
        self.set_text_color(40, 40, 40)
        self.cell(0, 10, self.title, 0, 1, "C")
        self.ln(5)

    def section_title(self, title):
        self.set_font("Arial", "B", 12)
        self.set_text_color(0, 0, 128)
        self.cell(0, 10, title, 0, 1)
        self.set_text_color(0, 0, 0)

    def section_body(self, text):
        self.set_font("Arial", "", 11)
        self.multi_cell(0, 8, text)
        self.ln()


# ---------- PDF 1: Cache ----------
pdf_cache = StyledPDF()
pdf_cache.set_title("Análise e Melhorias do Cache em Memória Personalizado")
pdf_cache.add_page()

pdf_cache.section_title("1. Estrutura Atual")
pdf_cache.section_body(
    """
O cache atual utiliza um Map nativo do JavaScript com funcionalidades como:
- TTL (tempo de expiração) por chave
- Limite de chaves
- Limpeza periódica
- Singleton para instância única
"""
)

pdf_cache.section_title("2. Problemas Detectados")
pdf_cache.section_body(
    """
- Concorrência em múltiplas threads/processos: o Map não é thread-safe.
- Condição de corrida: chamadas concorrentes a set/get podem interferir.
- Limpeza síncrona: cleanup() bloqueia o event loop se o cache for grande.
- Política de remoção fraca: FIFO simples, sem análise de uso real.
"""
)

pdf_cache.section_title("3. Melhorias Sugeridas")
pdf_cache.section_body(
    """
- Usar Mutex (ex: async-mutex) para proteger chamadas concorrentes.
- Implementar LRU com Map + DoublyLinkedList para remoção eficiente.
- Fazer cleanup assíncrono com setInterval ou worker thread.
- Substituir TTL global por setTimeout individual por chave.
- Modularizar: separar CacheStore (dados) de CacheController (regras).
"""
)

pdf_cache.section_title("4. Recursos Futuramente Interessantes")
pdf_cache.section_body(
    """
- Cache distribuído com Redis para clusters.
- Suporte a stale-while-revalidate para revalidação assíncrona.
- Métricas e contadores de cache hits/misses.
- Persistência leve com journal de expiração.
"""
)

pdf_cache_path = "Cache_Personalizado_Analise_Aprimorada.pdf"
pdf_cache.output(pdf_cache_path)

# ---------- PDF 2: Desafio Completo ----------
pdf_desafio = StyledPDF()
pdf_desafio.set_title("Resumo Técnico Completo - Desafio 3: Physical Store")
pdf_desafio.add_page()

pdf_desafio.section_title("1. Objetivo")
pdf_desafio.section_body(
    """
Criar uma API em NestJS que retorna lojas físicas com opções de entrega baseadas em um CEP.
Decidir entre entrega local (PDV) ou via Correios (LOJA) com base na distância.
"""
)

pdf_desafio.section_title("2. Endpoints Obrigatórios")
pdf_desafio.section_body(
    """
- GET /stores
- GET /stores/:id
- GET /stores/state/:uf
- GET /stores/cep/:cep
"""
)

pdf_desafio.section_title("3. Entidade Store")
pdf_desafio.section_body(
    """
Campos: storeID, storeName, type (PDV/LOJA), shippingTimeInDays, localização, etc.
"""
)

pdf_desafio.section_title("4. Responses Esperadas")
pdf_desafio.section_body(
    """
Response 1: Para listagem e busca por ID/estado
{
  "stores": [...],
  "limit": 1,
  "offset": 1,
  "total": 100
}

Response 2: Para busca por CEP, inclui pins do mapa
{
  "stores": [...],
  "pins": [...],
  "limit": 1,
  "offset": 1,
  "total": 100
}
"""
)

pdf_desafio.section_title("5. Lógica de Entrega")
pdf_desafio.section_body(
    """
PDV (  50km): Motoboy da loja, valor fixo R$ 15, prazo = shippingTimeInDays + configuração.
LOJA (> 50km): Via Correios (Sedex/PAC), prazo = retorno dos Correios + shippingTimeInDays.
"""
)

pdf_desafio.section_title("6. APIs Externas Utilizadas")
pdf_desafio.section_body(
    """
- Google Maps Distance Matrix API (distância)
- ViaCEP (dados de endereço via CEP)
- Correios (prazo/preço para Sedex e PAC)
"""
)

pdf_desafio.section_title("7. Modelagem Adicional")
pdf_desafio.section_body(
    """
StoreDeliveryConfig: Configuração de prazo extra por loja e tipo.
DeliveryCalculation: Registro temporário de cálculos de frete com TTL.
Delivery: Entregas confirmadas.
"""
)

pdf_desafio.section_title("8. Rotas Recomendadas")
pdf_desafio.section_body(
    """
POST /delivery/calculate  - calcula entrega e salva temporariamente.
POST /delivery/confirm/:calculationId  - confirma e salva entrega no banco.
"""
)

pdf_desafio.section_title("9. Boas Práticas e Requisitos Técnicos")
pdf_desafio.section_body(
    """
- NestJS com princípios SOLID
- Testes unitários com mocks
- Swagger documentando todos os endpoints
- Uso de cache para otimizar reuso de cálculos de frete
"""
)

pdf_desafio_path = "Desafio_3_Physical_Store_Resumo_Ilustrado.pdf"
pdf_desafio.output(pdf_desafio_path)

pdf_cache_path, pdf_desafio_path
