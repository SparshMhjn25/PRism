import pool from "../config/pool.js"
import type{ WebhookDeliveryStatus } from "../types/finding.js";

export async function claimWebhookDelivery(deliveryID: string, eventType: string){
    const { rows } = await pool.query("INSERT INTO webhook_deliveries (delivery_id, event_type, status) VALUES ($1, $2, $3) ON CONFLICT (delivery_id) DO UPDATE SET status = 'processing', updated_at = NOW() WHERE webhook_deliveries.status = 'failed' RETURNING delivery_id;", [deliveryID, eventType, 'processing']);
    if(rows.length === 0){
        return false;
    }
    return true;
}

export async function updateWebhookDeliveryStatus(deliveryId: string, status: WebhookDeliveryStatus){
    const { rows } = await pool.query("UPDATE webhook_deliveries SET status = $1 , updated_at = NOW() WHERE delivery_id = $2 RETURNING delivery_id", [status, deliveryId]);
    if(rows.length === 0){
        return false;
    }
    return true;
}

export async function getWebhookDelivery(deliveryId: string){
    const { rows } = await pool.query("SELECT delivery_id, status FROM webhook_deliveries WHERE delivery_id = $1", [deliveryId]);
    return rows[0];
}