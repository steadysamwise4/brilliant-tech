async function commentFormHandler(event) {
    event.preventDefault();
  
    const comment_text = document.querySelector('textarea[name="comment-blog-body"]').value.trim();
  
    const blog_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  
    if (comment_text) {
        const response = await fetch('/api/blogcomments', {
          method: 'POST',
          body: JSON.stringify({
            blog_id,
            comment_text
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.ok) {
          document.location.reload();
        } else {
          alert(response.statusText);
        }
      }
    
  }
  
  document.querySelector('.comment-blog-form').addEventListener('submit', commentFormHandler);