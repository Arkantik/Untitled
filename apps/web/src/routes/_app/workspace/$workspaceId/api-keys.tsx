import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { NewKeyBanner, CreateKeyForm } from './api-keys-form';
import { ApiKeyList, ApiKeyInfoNote } from './api-keys-list';

export const Route = createFileRoute('/_app/workspace/$workspaceId/api-keys')({
  component: ApiKeysPage,
});

export type ApiKey = {
  id: string;
  name: string;
  lastFour: string;
  scope: 'read_write' | 'read_only';
  lastUsedAt: string | null;
  expiresAt: string | null;
};

const INITIAL_KEYS: ApiKey[] = [
  { id: '1', name: 'Production', lastFour: 'e6', scope: 'read_write', lastUsedAt: 'today', expiresAt: null },
  { id: '2', name: 'Staging integration', lastFour: 'f1', scope: 'read_only', lastUsedAt: null, expiresAt: null },
];

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  function handleCreated(name: string, scope: ApiKey['scope']) {
    const raw = `sk_prod_${Math.random().toString(36).slice(2, 34)}`;
    setKeys((prev) => [
      { id: String(Date.now()), name, lastFour: raw.slice(-2), scope, lastUsedAt: null, expiresAt: null },
      ...prev,
    ]);
    setNewKeyValue(raw);
    setShowCreate(false);
  }

  function handleRevoke(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">API keys</h1>
        <p className="text-sm text-muted-foreground">Manage keys for accessing the Pulsarr REST API.</p>
      </div>

      {newKeyValue && (
        <NewKeyBanner value={newKeyValue} onDismiss={() => setNewKeyValue(null)} />
      )}

      <ApiKeyList
        keys={keys}
        onRevoke={handleRevoke}
        showCreate={showCreate}
        onCreateToggle={() => setShowCreate((v) => !v)}
      />

      {showCreate && (
        <CreateKeyForm onCreated={handleCreated} onCancel={() => setShowCreate(false)} />
      )}

      <ApiKeyInfoNote />
    </div>
  );
}
