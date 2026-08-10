// Vercel Serverless Function: recebe a notificação (webhook) do Mercado Pago
// e atualiza o pedido no Firestore.
// Rota final: /api/webhook-pagamento
//
// Precisa de variáveis de ambiente no Vercel:
//   MP_ACCESS_TOKEN            (o mesmo token usado em criar-pagamento.js)
//   FIREBASE_SERVICE_ACCOUNT   (JSON da conta de serviço do Firebase, em uma linha só)
//
// Como conseguir o FIREBASE_SERVICE_ACCOUNT:
//   Console Firebase > Configurações do projeto > Contas de serviço > Gerar nova chave privada
//   Copie TODO o conteúdo do arquivo .json baixado e cole como valor dessa variável no Vercel.

const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
const db = admin.firestore();

module.exports = async function handler(req, res) {
  try {
    const params = req.query || {};
    const body = req.body || {};

    const paymentId = params["data.id"] || body?.data?.id || params.id;
    const topic = params.type || params.topic || body?.type;

    if (topic !== "payment" || !paymentId) {
      res.status(200).send("ignorado");
      return;
    }

    const resp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }
    });
    const pagamento = await resp.json();

    const pedidoId = pagamento.external_reference;
    if (!pedidoId) {
      res.status(200).send("sem pedido associado");
      return;
    }

    let novoStatus = "aguardando_pagamento";
    if (pagamento.status === "approved") novoStatus = "pago";
    else if (pagamento.status === "rejected") novoStatus = "recusado";
    else if (pagamento.status === "cancelled") novoStatus = "cancelado";
    else if (pagamento.status === "pending" || pagamento.status === "in_process") novoStatus = "pendente";

    await db.collection("pedidos").doc(pedidoId).update({
      status: novoStatus,
      mercadoPagoId: String(paymentId),
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("erro");
  }
};
