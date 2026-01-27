import { useOrganization } from "../../context/OrganizationContext";

export default function OrganizationSwitcher() {
  const { organizations, activeOrg, setActiveOrg } = useOrganization();

  if (!organizations.length) return null;

  return (
    <select
      value={activeOrg?.id}
      onChange={(e) => {
        const org = organizations.find((o) => o.id === e.target.value);
        if (org) setActiveOrg(org);
      }}
    >
      {organizations.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
