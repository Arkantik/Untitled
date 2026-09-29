import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, Copy01Icon } from '@hugeicons/core-free-icons';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Field } from '~/components/ui/field';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '~/components/ui/card';
import { cn } from '~/lib/utils';

type Scope = 'read_write' | 'read_only';

const SCOPES: { value: Scope; label: string; desc: string }[] = [
  { value: 'read_write', label: 'Read & Write', desc: 'Create, schedule, and publish posts. Read all workspace data.' },
  { value: 'read_only', label: 'Read only', desc: 'Read posts, analytics, and account data. Cannot publish.' },
];

export function NewKeyBanner({ value, onDismiss }: { value: string; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-md border border-success/30 bg-success/8 p-4">
      <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-success">
        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3.5" aria-hidden />
        API key created — copy it now
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-sm border border-border bg-card px-2.5 py-1.5 font-mono text-xs">
          {value}
        </code>
        <button
          type="button"
          aria-label={copied ? 'Copied' : 'Copy key'}
          onClick={copy}
          className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="flex transition-transform duration-fast group-hover:scale-110 group-hover:-rotate-6">
            <HugeiconsIcon icon={copied ? CheckmarkCircle01Icon : Copy01Icon} className="size-4" aria-hidden />
          </span>
        </button>
        <Button variant="outline" size="sm" type="button" onClick={onDismiss}>Done</Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Shown once. You cannot retrieve it after dismissing this banner.</p>
    </div>
  );
}

export function CreateKeyForm({
  onCreated,
  onCancel,
}: {
  onCreated: (name: string, scope: Scope) => void;
  onCancel: () => void;
}) {
  const [keyName, setKeyName] = useState('');
  const [scope, setScope] = useState<Scope>('read_write');

  return (
    <Card className="border-primary">
      <CardHeader className="border-b border-primary/20 bg-primary/8">
        <CardTitle className="text-sm text-primary">New API key</CardTitle>
        <CardDescription>Give it a name so you know where it's used.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <Field label="Key name">
          {(props) => (
            <Input {...props} type="text" placeholder="e.g. GitHub Actions, Zapier, Internal bot" value={keyName} onChange={(e) => setKeyName(e.target.value)} />
          )}
        </Field>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Access level</legend>
          <div className="mt-1 space-y-2">
            {SCOPES.map((s) => (
              <label
                key={s.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
                  scope === s.value ? 'border-primary bg-primary/8' : 'border-border hover:bg-muted/50',
                )}
              >
                <input type="radio" name="key-scope" value={s.value} checked={scope === s.value} onChange={() => setScope(s.value)} className="mt-0.5 accent-primary" />
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>
      </CardContent>
      <CardFooter className="gap-2 border-t border-border px-6 py-4">
        <Button type="button" disabled={!keyName.trim()} onClick={() => onCreated(keyName, scope)}>Create key</Button>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
      </CardFooter>
    </Card>
  );
}
