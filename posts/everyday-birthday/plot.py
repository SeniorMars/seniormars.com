import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Load your data
df = pd.read_csv("data.csv")

# Set the overall aesthetics
sns.set_theme()

# Create the plot
plt.figure(figsize=(14, 8))  # Larger figure size for better visibility
# Define custom colors for each model
palette = {"IEPModel": "deepskyblue", "ParModel": "coral"}
plot = sns.lineplot(
    x='students',
    y='probability',
    hue='model',
    style='model',
    markers=False,
    dashes=False,
    data=df,
    palette=palette
)

# Customizing x-axis ticks
plt.xticks(
    [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
    ['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k']
)

# Adding annotations (customize as needed)
plt.axhline(0.57, ls='--', color='gray')
plt.axvline(2366, ls='--', color='gray')  # Example vertical line
plot.text(1000, 0.55, 'Expected Average', verticalalignment='bottom', horizontalalignment='right')

# Enhancing the plot
plt.title('Probability Comparison Between Models')
plt.xlabel('Number of Students')
plt.ylabel('Probability')
plt.ylim(0, 1)  # Set y-axis limits
plt.grid(True, which="both", ls="--", linewidth=0.5)

# Legend
plt.legend(title='Model', loc='upper left')

# Save or show the plot
plt.savefig('comparison_plot.png')
# clear plot
plt.clf()

# Create a violin plot
plt.figure(figsize=(14, 8))
sns.violinplot(x='model', y='probability', data=df, palette="Pastel1")

# Enhancing the plot
plt.title('Probability Distribution by Model')
plt.xlabel('Model')
plt.ylabel('Probability')

# Show the plot
plt.savefig('violin.png')

plt.clf()

# Assuming time is in the format '866.458µs' and you want to convert it to milliseconds
df['time_ms'] = df['time'].replace({'µs': '*1e-3', 'ms': '*1', 's': '*1000'}, regex=True).map(pd.eval)

# Create the scatter plot with regression line
plt.figure(figsize=(14, 8))
sns.lmplot(x='students', y='time_ms', hue='model', data=df, ci=None, palette="Set1")

# Enhancing the plot
plt.title('Simulation Time vs Number of Students', pad=5)
plt.subplots_adjust(top=0.85)  # Adjust the top spacing of the subplot area
plt.xlabel('Number of Students')
plt.ylabel('Time (milliseconds)')
plt.grid(True)

# Show the plot
plt.savefig('scatter.png')
plt.show()
