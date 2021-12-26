async function newFormHandler(event) {
    event.preventDefault();
  
    const title = document.querySelector('#title-input-link').value;
    const author = document.querySelector('#author-input-link').value;
    const description = document.querySelector('#description-input-link').value;
    const link_url = document.querySelector('#url-input-link').value;
  
    const response = await fetch(`/api/links`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        author,
        description,
        link_url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('#add-link-form').addEventListener('submit', newFormHandler);