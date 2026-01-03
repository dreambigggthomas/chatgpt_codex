import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/generate/route';

function buildRequest(formData: FormData) {
  return new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    body: formData
  });
}

describe('/api/generate validation', () => {
  it('rejects missing ids', async () => {
    const formData = new FormData();
    const res = await POST(buildRequest(formData));
    expect(res.status).toBe(400);
  });
});
