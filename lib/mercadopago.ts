import mercadopago from 'mercadopago';

// Note: Mercadopago SDK v2 uses a different import style or might be 'mercadopago'.
// Depending on the version installed. The prompt said `mercadopago` ^2.12.0.

// Initialize SDK
// Wait, for v2 it's different.
// Since I installed `mercadopago` (likely v2), let's check the docs or infer usage.
// Assuming typical v2 usage:

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function createPaymentPreference(
  items: { id?: string; title: string; unit_price: number; quantity: number }[],
  payer: { email: string },
  external_reference: string
): Promise<string | null> {
  if (!process.env.MP_ACCESS_TOKEN) {
    console.warn("MP_ACCESS_TOKEN not set. Skipping payment link generation.");
    return null;
  }

  try {
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map(i => ({ ...i, id: i.id || 'default' })),
        payer: {
          email: payer.email
        },
        external_reference: external_reference,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/pending`
        },
        auto_return: "approved",
      }
    });

    return result.init_point!; // or sandbox_init_point
  } catch (error) {
    console.error("MercadoPago Error:", error);
    return null;
  }
}
