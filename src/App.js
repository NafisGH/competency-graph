import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
// import './App.css';

const skillsData = [
  {
    name: "Финансовый аналитик",
    mainSkills: ["Excel", "SQL", "VBA", "1С"],
    otherSkills: ["Power BI", "Python"],
  },
  {
    name: "Предприниматель",
    mainSkills: ["1C", "Excel", "Power BI"],
    otherSkills: ["Google Analytics", "Яндекс.Метрика", "Python", "SQL", "Tilda"],
  },
  {
    name: "Продуктовый дизайнер",
    mainSkills: ["Figma", "Sketch", "Illustrator", "Photoshop", "Principle", "Tilda"],
    otherSkills: ["Shopify", "Protopie", "Cinema 4D"],
  },
  {
    name: "Менеджер проекта",
    mainSkills: ["Visio", "1C", "Google Analytics", "Яндекс.Метрика", "Python", "SQL", "Tilda"],
    otherSkills: ["Figma", "Sketch", "Shopify"],
  },
  {
    name: "Финансовый менеджер",
    mainSkills: ["1C", "Excel", "Power BI"],
    otherSkills: ["BPMN"],
  },
  {
    name: "Руководитель финансового департамента компании",
    mainSkills: ["Sketch", "Figma"],
    otherSkills: ["Shopify", "HQL"],
  },
  {
    name: "Продуктовый аналитик",
    mainSkills: ["Google Analytics", "Яндекс.Метрика", "SQL", "Power BI", "Python", "Excel"],
    otherSkills: ["HQL", "Tableau", "R", "Machine learning"],
  },
  {
    name: "Руководитель финансового продукта",
    mainSkills: ["Visio"],
    otherSkills: ["Python"],
  },
  {
    name: "Менеджер по маркетингу",
    mainSkills: ["Google Analytics", "Яндекс.Метрика", "Google Ads", "Ahrefs", "Главред", "My Target"],
    otherSkills: ["Tilda", "Photoshop", "Xenu", "Python"],
  },
  {
    name: "Менеджер по цифровой трансформации",
    mainSkills: ["Visio", "Google Analytics", "Яндекс.Метрика", "Python", "SQL", "Tilda"],
    otherSkills: ["Figma", "Sketch", "Shopify"],
  },
];

// Создаем уникальный список компетенций из mainSkills и otherSkills
const uniqueCompetencies = (() => {
  const allCompetencies = new Set();
  skillsData.forEach((item) => {
    item.mainSkills.forEach((skill) => allCompetencies.add(skill));
    item.otherSkills.forEach((skill) => allCompetencies.add(skill));
  });
  return Array.from(allCompetencies);
})();

function App() {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom, null, { renderer: "canvas", useDirtyRect: true });
    setChartInstance(myChart);

    const nodes = [];
    const competencyNodes = []; // Узлы компетенций
    const skillNodes = []; // Узлы навыков
    const links = [];

    const innerCircleRadius = 200; // Радиус для навыков
    const outerCircleRadius = 450; // Радиус для компетенций

    // Генерируем узлы компетенций
    uniqueCompetencies.forEach((competency, index) => {
      const angle = (index / uniqueCompetencies.length) * 2 * Math.PI;
      const x = Math.cos(angle) * outerCircleRadius;
      const y = Math.sin(angle) * outerCircleRadius;

      const node = {
        id: `competency-${index}`,
        name: competency,
        category: "competency",
        value: 1,
        symbolSize: 70,
        itemStyle: { color: "#FFD4AD" },
        x: x,
        y: y,
        angle: angle, // Сохраняем угол для дальнейшего использования
        originalAngle: angle,
        originalX: x,
        originalY: y,
        label: {
          show: true,
          position: "inside",
          fontSize: 12,
          width: 80,
          overflow: "break",
          lineHeight: 15,
        },
      };
      competencyNodes.push(node);
      nodes.push(node);
    });

    // Генерируем узлы навыков
    skillsData.forEach((skill, index) => {
      const angle = (index / skillsData.length) * 2 * Math.PI;
      const x = Math.cos(angle) * innerCircleRadius;
      const y = Math.sin(angle) * innerCircleRadius;

      const node = {
        id: `skill-${index}`,
        name: skill.name,
        category: "skill",
        value: 1,
        symbolSize: 50,
        itemStyle: { color: "#ADADAD" },
        x: x,
        y: y,
        angle: angle, // Сохраняем угол для дальнейшего использования
        originalAngle: angle,
        originalX: x,
        originalY: y,
        label: {
          show: true,
          position: "center",
          fontSize: 12,
          width: 100,
          overflow: "break",
          lineHeight: 15,
        },
      };
      skillNodes.push(node);
      nodes.push(node);
    });

    // Установка опций графика
    myChart.setOption({
      title: {
        text: "График навыков и компетенций",
        left: "center",
      },
      series: [
        {
          type: "graph",
          layout: "none",
          data: nodes,
          links: links,
          roam: true,
          lineStyle: {
        opacity: 0.6,
        width: 2,
        // curveness: 0.3, // Добавлено свойство curveness для изогнутых линий
      },
          label: {
            show: true,
            position: "center",
            fontSize: 12,
            width: 80,
            overflow: "break",
            lineHeight: 15,
          },
          labelLayout: function (params) {
            const node = params.data;
            if (node && node.category === "competency") {
              const angle = node.angle;
              const offset = 80;
              const dx = Math.cos(angle) * offset;
              const dy = Math.sin(angle) * offset;
              return {
                dx: dx,
                dy: dy,
                align: Math.abs(angle) < Math.PI / 2 ? "left" : "right",
                verticalAlign: "middle",
              };
            }
            return {};
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          lineStyle: {
            opacity: 0.6,
            width: 2,
            curveness: 0.2,
          },
          animationDurationUpdate: 1500,
          animationEasingUpdate: "cubicInOut",
        },
      ],
    });

    // Логика при клике на узел
    myChart.on("click", function (params) {
      // Сброс предыдущих выделений и динамических связей
      let updatedNodes = nodes.map((node) => {
        let color = node.category === "competency" ? "#FFD4AD" : "#ADADAD";
        return {
          ...node,
          itemStyle: {
            ...node.itemStyle,
            color: color,
          },
          label: {
            ...node.label,
          },
          x: node.originalX,
          y: node.originalY,
          angle: node.originalAngle,
        };
      });

      const resetLinks = [];

      // Если кликнули на навык
      if (params.data.category === "skill") {
        const clickedSkill = params.data.name;
        const skillNode = updatedNodes.find((node) => node.id === params.data.id);

        const relatedCompetencyIndices = [];
        const unrelatedCompetencyIndices = [];

        // Находим связанные компетенции
        skillsData.forEach((skill) => {
          if (skill.name === clickedSkill) {
            skill.mainSkills.concat(skill.otherSkills).forEach((competency) => {
              const index = uniqueCompetencies.indexOf(competency);
              if (index !== -1 && !relatedCompetencyIndices.includes(index)) {
                relatedCompetencyIndices.push(index);
              }
            });
          }
        });

        // Находим несвязанные компетенции
        for (let i = 0; i < competencyNodes.length; i++) {
          if (!relatedCompetencyIndices.includes(i)) {
            unrelatedCompetencyIndices.push(i);
          }
        }

        // Перестраиваем компетенции, группируя связанные вместе
        const totalCompetencies = competencyNodes.length;
        const angleIncrement = (2 * Math.PI) / totalCompetencies;
        let startAngle = skillNode.angle;

        // Убедимся, что startAngle между 0 и 2π
        if (startAngle < 0) {
          startAngle += 2 * Math.PI;
        }

        // Сортируем компетенции: сначала связанные, затем несвязанные
        const sortedCompetencyIndices = [...relatedCompetencyIndices, ...unrelatedCompetencyIndices];

        sortedCompetencyIndices.forEach((competencyIndex, i) => {
          const angle = (startAngle + angleIncrement * i) % (2 * Math.PI);

          // Находим узел компетенции в updatedNodes
          const competencyNode = updatedNodes.find((node) => node.id === `competency-${competencyIndex}`);
          competencyNode.angle = angle; // Обновляем угол
          competencyNode.x = Math.cos(angle) * outerCircleRadius;
          competencyNode.y = Math.sin(angle) * outerCircleRadius;

          // Обновляем itemStyle для выделения
          if (relatedCompetencyIndices.includes(competencyIndex)) {
            competencyNode.itemStyle = {
              ...competencyNode.itemStyle,
              color: "orange",
            };
          } else {
            competencyNode.itemStyle = {
              ...competencyNode.itemStyle,
              color: "#FFD4AD",
            };
          }
        });

        // Выделяем кликнутый навык
        skillNode.itemStyle = {
          ...skillNode.itemStyle,
          color: "green",
        };

        // Создаем связи между кликнутым навыком и связанными компетенциями
        const newLinks = relatedCompetencyIndices.map((competencyIndex) => ({
          source: skillNode.id,
          target: `competency-${competencyIndex}`,
          lineStyle: { color: "orange", width: 3, curveness: 0.2 },
        }));

        // Обновляем график
        myChart.setOption({
          series: [
            {
              data: updatedNodes,
              links: newLinks,
            },
          ],
        });
      }

      // Если кликнули на компетенцию
      else if (params.data.category === "competency") {
        const clickedCompetency = params.data.name;
        const competencyNode = updatedNodes.find((node) => node.id === params.data.id);

        const relatedSkillIndices = [];
        const unrelatedSkillIndices = [];

        // Находим связанные навыки
        skillsData.forEach((skill, skillIndex) => {
          if (
            skill.mainSkills.includes(clickedCompetency) ||
            skill.otherSkills.includes(clickedCompetency)
          ) {
            relatedSkillIndices.push(skillIndex);
          }
        });

        // Находим несвязанные навыки
        for (let i = 0; i < skillNodes.length; i++) {
          if (!relatedSkillIndices.includes(i)) {
            unrelatedSkillIndices.push(i);
          }
        }

        // Перестраиваем навыки, группируя связанные вместе
        const totalSkills = skillNodes.length;
        const angleIncrement = (2 * Math.PI) / totalSkills;
        let startAngle = competencyNode.angle;

        // Убедимся, что startAngle между 0 и 2π
        if (startAngle < 0) {
          startAngle += 2 * Math.PI;
        }

        // Сортируем навыки: сначала связанные, затем несвязанные
        const sortedSkillIndices = [...relatedSkillIndices, ...unrelatedSkillIndices];

        sortedSkillIndices.forEach((skillIndex, i) => {
          const angle = (startAngle + angleIncrement * i) % (2 * Math.PI);

          // Находим узел навыка в updatedNodes
          const skillNode = updatedNodes.find((node) => node.id === `skill-${skillIndex}`);
          skillNode.angle = angle; // Обновляем угол
          skillNode.x = Math.cos(angle) * innerCircleRadius;
          skillNode.y = Math.sin(angle) * innerCircleRadius;

          // Обновляем itemStyle для выделения
          if (relatedSkillIndices.includes(skillIndex)) {
            skillNode.itemStyle = {
              ...skillNode.itemStyle,
              color: "green",
            };
          } else {
            skillNode.itemStyle = {
              ...skillNode.itemStyle,
              color: "#ADADAD",
            };
          }
        });

        // Выделяем кликнутую компетенцию ярко оранжевым цветом
        competencyNode.itemStyle = {
          ...competencyNode.itemStyle,
          color: "orange",
        };

        // Создаем связи между кликнутой компетенцией и связанными навыками
        const newLinks = relatedSkillIndices.map((skillIndex) => ({
          source: competencyNode.id,
          target: `skill-${skillIndex}`,
          lineStyle: { color: "orange", width: 3, curveness: 0.2, },
        }));

        // Обновляем график
        myChart.setOption({
          series: [
            {
              data: updatedNodes,
              links: newLinks,
            },
          ],
        });
      } else {
        // Если кликнули в пустое пространство, сбрасываем график
        myChart.setOption({
          series: [
            {
              data: updatedNodes,
              links: resetLinks,
            },
          ],
        });
      }
    });

    // Устанавливаем пассивные обработчики событий для предотвращения блокировки
    chartDom.addEventListener("wheel", (e) => e.preventDefault(), { passive: true });

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "900px" }}>
      <div id="main" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
}

export default App;
