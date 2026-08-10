// Vercel Serverless Function: cria uma preferência de pagamento no Mercado Pago
// Rota final: /api/criar-pagamento
//
// Precisa da variável de ambiente MP_ACCESS_TOKEN configurada no Vercel
// (Project Settings > Environment Variables). Nunca coloque o Access Token no HTML.

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ erro: "Método não permitido" });
    return;
  }

  try {
    const { pedidoId, itens, cliente } = req.body;

    if (!pedidoId || !itens || !itens.length) {
      res.status(400).json({ erro: "Dados do pedido incompletos" });
      return;
    }

    const siteUrl = `https://${req.headers.host}`;

    const preferencia = {
      items: itens.map((item) => ({
        title: item.nome,
        quantity: item.quantidade,
        unit_price: Number(item.preco),
        currency_id: "BRL"
      })),
      payer: {
        name: cliente?.nome || "",
        email: cliente?.email || undefined
      },
      external_reference: pedidoId,
      back_urls: {
        success: `${siteUrl}/?pagamento=sucesso`,
        pending: `${siteUrl}/?pagamento=pendente`,
        failure: `${siteUrl}/?pagamento=falhou`
      },
      auto_return: "approved",
      notification_url: `${siteUrl}/api/webhook-pagamento`
    };

    const resposta = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
      },
      body: JSON.stringify(preferencia)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro Mercado Pago:", dados);
      res.status(500).json({ erro: "Erro ao criar preferência", detalhe: dados });
      return;
    }

    res.status(200).json({ init_point: dados.init_point, preference_id: dados.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro interno" });
  }
};
