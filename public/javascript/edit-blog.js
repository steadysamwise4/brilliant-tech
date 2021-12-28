async function editFormHandler(event) {
    event.preventDefault();
  
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    const title = document.querySelector("input[name='blog-title']").value.trim();
    const content = document.querySelector("input[name='content-input-blog']").value.trim();
    
    const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          content
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        document.location.replace("/blog-dashboard");
    } else {
        alert(response.statusText);
    }


  }
  
  document.querySelector('#edit-blog-form').addEventListener('submit', editFormHandler);