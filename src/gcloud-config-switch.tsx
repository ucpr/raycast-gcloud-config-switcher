import { List, Icon, Color, ActionPanel, Action } from "@raycast/api";
import { execSync } from "child_process";

interface Config {
  isActive: boolean;
  account: string;
  project: string;
  name: string;
}

export default function Command() {
  const rawConfigs: string[] = execSync('gcloud config configurations list').toString().trim().split("\n").slice(1);
  const configs: Config[] = rawConfigs.map((data: String) => {
    const pd = data.split(" ").filter(param => param !== "");
    return {
      name: pd[0],
      isActive: pd[1] === "True",
      account: pd[2],
      project: pd[3],
    };
  });

  return (
    <List>
      {configs.map((data: Config, idx: number) => (
        <List.Item
          key={idx}
          icon={
            data.isActive ? {
              source: Icon.CheckCircle,
              tintColor: Color.Green,
            } : {
              source: Icon.Circle,
              tintColor: Color.SecondaryText,
            }
          }
          title={data.project}
          subtitle={data.account}
          actions={
            <ActionPanel>
              <Action title="select" onAction={() => {
                const out = execSync('gcloud config configurations activate ' + data.name).toString();
                console.log(out);
              }} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
