export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
  };
  
  export class FirestorePermissionError extends Error {
    public readonly context: SecurityRuleContext;
  
    constructor(context: SecurityRuleContext) {
      const message = `
  FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
  {
    "auth": "The user's auth object (request.auth) will be available in the browser console logs.",
    "operation": "${context.operation}",
    "path": "/databases/(default)/documents/${context.path}"
    ${context.requestResourceData ? `,"resource": ${JSON.stringify(context.requestResourceData, null, 2)}` : ''}
  }
      `.trim();
      
      super(message);
      this.name = 'FirestorePermissionError';
      this.context = context;
  
      // This is to make the error message more readable in the browser console.
      console.log('DENIED security rule context:', {
        operation: context.operation,
        path: context.path,
        requestResourceData: context.requestResourceData,
      });
      console.log("For debugging, the user's auth object (request.auth) can be inspected by adding `function isOwner(userId) { debug(request.auth); return request.auth != null && request.auth.uid == userId; }` to your firestore.rules file.");
    }
  }
  