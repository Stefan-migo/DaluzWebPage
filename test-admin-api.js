// Quick test to check what the API returns
fetch('http://localhost:3000/api/admin/products?include_archived=true&limit=50')
  .then(r => r.json())
  .then(data => {
    console.log('Total products:', data.pagination?.total);
    console.log('Products returned:', data.products?.length);
    console.log('Total pages:', data.pagination?.totalPages);
    console.log('Statuses:', [...new Set(data.products?.map(p => p.status))]);
    console.log('First product:', data.products?.[0]);
  })
  .catch(err => console.error(err));
