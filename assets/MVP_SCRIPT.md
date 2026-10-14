# Progress overview and MVP speaker script

## Progress overview (45 seconds)

Since our idea pitch, we have moved from the product concept to a clickable web prototype.

[First reveal] We defined the core user journey: review a purchase, check a policy, and create a return task.

[Second reveal] We implemented the frontend so users can explore tasks, prepare a return plan, and manually update their progress. Changes persist locally in the browser.

[Third reveal] Our next step is to connect real purchase extraction and policy retrieval, then compare rules, LLM, and hybrid planning. The current MVP uses sample data and manual updates.

## MVP walkthrough (90–120 seconds)

Open `#mvp`. Click “Launch live frontend”. Use the app navigation, or close the overlay and use the slide shortcuts to jump to a screen. Shortcuts retain existing demo data.

**Today:** Let me show you our current web MVP. We will follow one example: returning a pair of wireless headphones. On the Today page, the user can immediately see the next action and the approaching deadline.

**Purchase review:** Before saving a task, the user can review and edit the purchase information. This gives them an opportunity to correct the item, amount, or dates. The prototype demonstrates this review experience. Automated extraction is a planned integration.

**Return task:** The return task brings together the deadline, estimated refund, and next action. This helps the user understand what they need to do without switching between different documents.

**Plan:** The plan page shows what to prepare and groups sample returns into drop-off stops. The user can check the preparation steps and save the plan. The locations and itinerary are illustrative, with no live route optimization.

**Tracking:** After taking action, the user can manually update the status and follow the return toward a refund. The prototype does not receive real carrier or retailer updates.

**Close:** This MVP lets us demonstrate the complete user experience before connecting the AI and retailer services.

## 中文操作提示

Progress overview：右键三次，依次讲流程、前端、下一步。入口 `#progress`。
MVP：入口 `#mvp`，点击 Launch live frontend 进入现有前端。右键一次显示四个直达按钮；关闭演示后可直接切换到购买确认、任务、计划、追踪。演示中不需要输入真实个人数据。
