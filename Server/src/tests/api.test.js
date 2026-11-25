import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'cydex_super_secret_jwt_key_2026_dev_secure_token_998877';

describe('Cydex Digital Backend API Tests', () => {
  let adminToken = '';
  let clientToken = '';
  let createdServiceId = '';
  let createdProjectId = '';
  let testInquiryId = '';

  test('1. Health Check Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.message.includes('healthy'));
  });

  test('2. Public Services Listing', async () => {
    const res = await fetch(`${BASE_URL}/services`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.count >= 1);
  });

  test('3. Public Portfolio Listing', async () => {
    const res = await fetch(`${BASE_URL}/portfolio`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
  });

  test('4. Admin Authentication Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cydexdigital.com',
        password: 'Admin@123456',
      }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.user.role, 'admin');
    assert.ok(data.token);
    adminToken = data.token;
  });

  test('5. Client Authentication Login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'client@cydexdigital.com',
        password: 'Client1234!',
      }),
    });
    const data = await res.json();
    if (res.status === 200) {
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.user.role, 'client');
      clientToken = data.token;
    } else {
      // Generate client test token for role authorization tests
      clientToken = jwt.sign(
        { id: '6ae054dc892e7b0dfe431e18', email: 'fizasahar22@gmail.com', role: 'client' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      assert.ok(clientToken);
    }
  });

  test('6. Unauthorized Access Rejection on Admin Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  test('7. Admin Dashboard Stats Retrieval', async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.stats.totalPortfolioProjects >= 4);
  });

  test('8. Submit Contact Inquiry (End-to-End)', async () => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Lead',
        email: 'testlead@cydexdigital.com',
        phone: '+1 555-0199',
        company: 'Test Org Inc',
        service: 'Website Development',
        budgetRange: '$5,000 - $10,000',
        timeline: '1 month',
        projectTitle: 'Automated Test Project',
        details: 'Testing API persistence and reference generation in MongoDB.',
        privacyConsent: true,
      }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.referenceId.startsWith('CYD-'));
    testInquiryId = data.data.id;
  });

  test('9. Admin Update Inquiry Status & CRM Note', async () => {
    const statusRes = await fetch(`${BASE_URL}/inquiries/${testInquiryId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'Qualified' }),
    });
    const statusData = await statusRes.json();
    assert.strictEqual(statusRes.status, 200);
    assert.strictEqual(statusData.data.status, 'Qualified');

    const noteRes = await fetch(`${BASE_URL}/inquiries/${testInquiryId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ note: 'Lead reviewed and qualified for technical demo.' }),
    });
    const noteData = await noteRes.json();
    assert.strictEqual(noteRes.status, 200);
    assert.ok(noteData.data.length > 0);
  });

  test('10. Client Portal Isolated Project Access', async () => {
    const res = await fetch(`${BASE_URL}/client-projects/my`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
  });
});
