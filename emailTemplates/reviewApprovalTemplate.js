// mailTemplates/reviewApprovalTemplate.js

exports.reviewApprovalTemplate = (review) => {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; background-color: #f8f9fa; padding: 25px; border-radius: 8px;">
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .fadeIn {
        animation: fadeIn 0.8s ease-in-out;
      }

      .btn {
        background-color:#0d6efd; 
        color:#fff; 
        padding:10px 20px; 
        text-decoration:none; 
        border-radius:5px; 
        display:inline-block; 
        transition: all 0.3s ease;
      }

      .btn:hover {
        background-color:#084298;
        box-shadow: 0 0 10px rgba(13,110,253,0.6);
      }
    </style>

    <div class="fadeIn">
      <h2 style="color: #0d6efd; text-align: center;">📢 New Review Received</h2>

        <p style="font-size: 16px; margin-top: 10px; text-transform: capitalize;">
        <strong>${review.firstName} ${
          review.lastName || ""
        }</strong> gave a review for your project 
        <strong style="color: #0d6efd;">${review.projectName}</strong>.
      </p>


      <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p><strong>⭐ Rating:</strong> ${review.rating} / 5</p>
        <p><strong>💬 Comment:</strong> ${review.comment}</p>
        <p><strong>🔗 Project Link:</strong> 
          <a href="${
            review.projectLink
          }" target="_blank" style="color:#0d6efd;">
            ${review.projectLink}
          </a>
        </p>
      </div>

      <p style="font-size: 15px;">
        Please login to your <strong>Admin Dashboard</strong> and approve this review.
      </p>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://riteshmishra.onlin/reviews" target="_blank" class="btn">
          ✅ Approve Review
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 13px; text-align:center; color:#6c757d;">
        — This is an automatic message from your portfolio website.
      </p>
    </div>
  </div>
  `;
};
