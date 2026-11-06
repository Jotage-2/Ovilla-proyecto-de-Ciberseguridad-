// Protege la base remota: el reinicio debe realizarse explícitamente en Supabase.
console.error('Este comando de reinicio está deshabilitado para PostgreSQL. Gestiona los datos desde Supabase.');
process.exitCode = 1;
