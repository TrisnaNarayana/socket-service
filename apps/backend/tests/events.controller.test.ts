import { describe, it, expect } from 'vitest';
import { publishEventSchema } from '@vms/shared';

describe('Events Controller Validation Tests', () => {
  it('harus memvalidasi payload publish event yang benar', () => {
    const validPayload = {
      projectId: 'project-ecommerce',
      eventName: 'ORDER_CREATED',
      target: {
        type: 'ROOM',
        room: 'room:orders',
      },
      data: {
        orderId: 'ORD-9982',
        totalAmount: 150000,
      },
    };

    const result = publishEventSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('harus menolak payload publish event tanpa projectId', () => {
    const invalidPayload = {
      eventName: 'ORDER_CREATED',
      target: {
        type: 'GLOBAL',
      },
      data: {},
    };

    const result = publishEventSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
  });
});
