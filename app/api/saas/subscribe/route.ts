import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize MP
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
  try {
    const { tenantSlug, userEmail } = await req.json();

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: 'PRO-PLAN',
            title: 'Turnero Pro - Plan Full',
            quantity: 1,
            unit_price: 15000,
            currency_id: 'ARS',
          }
        ],
        payer: {
            email: userEmail
        },
        back_urls: {
            success: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/demo/clinica?status=success`,
            failure: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/demo/clinica?status=failure`,
            pending: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/demo/clinica?status=pending`
        },
        auto_return: 'approved',
        external_reference: tenantSlug
      }
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    console.error("MP Preference Error:", error);
    return NextResponse.json({ error: "Failed to create preference" }, { status: 500 });
  }
}

export const runtime = 'nodejs';
