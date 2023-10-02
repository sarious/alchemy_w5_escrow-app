export function getErrorDescription(error: any) {
  const reason = error.reason as string;
  const code = error.code as string;
  return `${reason} (code=${code})`;
}
