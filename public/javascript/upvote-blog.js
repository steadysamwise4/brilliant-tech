async function upvoteClickHandler(event) {
    event.preventDefault();
    
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

      const response = await fetch('/api/blogs/upvote', {
        method: 'PUT',
        body: JSON.stringify({
          blog_id: id
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
  
  document.querySelector('#upvote-blog-btn').addEventListener('click', upvoteClickHandler);