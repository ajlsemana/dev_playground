export function generateNoticeHTML(data: any) {

  const lastActions = data.actions.slice(0, 3).map((a: any) => `
    <li>${a.type} - ${a.outcome} (${new Date(a.createdAt).toLocaleString()})</li>
  `).join("");

  const payBefore = new Date();
  payBefore.setDate(payBefore.getDate() + 3);

  return `
    <html>
      <body>
        <h1>Payment Reminder Notice</h1>

        <h3>Customer</h3>
        <p>${data.customer.name}</p>

        <h3>Loan</h3>
        <p>Outstanding: ${data.loan.outstanding}</p>

        <h3>Case Info</h3>
        <p>DPD: ${data.dpd}</p>
        <p>Stage: ${data.stage}</p>
        <p>Assigned To: ${data.assignedTo}</p>

        <h3>Last Actions</h3>
        <ul>${lastActions}</ul>

        <p>Pay before: ${payBefore.toLocaleDateString()}</p>

        <hr/>
        <small>Generated at ${new Date().toLocaleString()}</small>

      </body>
    </html>
  `;
}