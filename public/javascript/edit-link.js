async function editFormHandler(event) {
    event.preventDefault();
  
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
    const title = document.querySelector("input[name='link-title']").value.trim();
    const author = document.querySelector("input[name='link-author']").value.trim();
    const description = document.querySelector("input[name='link-description']").value.trim();

    const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          author,
          description
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
    }


  }
  
  document.querySelector('#edit-link-form').addEventListener('submit', editFormHandler);