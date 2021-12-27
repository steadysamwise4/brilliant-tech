async function newFormHandler(event) {
    event.preventDefault();
  
    const title = document.querySelector('#title-input-blog').value;
    const content = document.querySelector('#content-blog').value;
   
    const response = await fetch(`/api/blogs`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/blog-dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  document.querySelector('#add-blog-form').addEventListener('submit', newFormHandler);