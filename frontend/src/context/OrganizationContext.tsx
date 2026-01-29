import { createContext, useContext, useEffect, useState } from "react";
import { fetchOrganizations, switchOrganization } from "../api/organization.api";

interface Organization {
  id: string;
  name: string;
  role: string;
}

interface OrganizationContextData {
  organizations: Organization[];
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextData>(
  {} as OrganizationContextData
);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrgState] = useState<Organization | null>(null);

  useEffect(() => {
    fetchOrganizations().then((orgs) => {
      setOrganizations(orgs);
      if (orgs.length) setActiveOrgState(orgs[0]);
    });
  }, []);

  async function setActiveOrg(org: Organization) {
    await switchOrganization(org.id);
    setActiveOrgState(org);
    localStorage.setItem("@sdm:org", JSON.stringify(org));
  }

  return (
    <OrganizationContext.Provider
      value={{ organizations, activeOrg, setActiveOrg }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  return useContext(OrganizationContext);
}
