import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy.ndimage import gaussian_filter

sns.set_theme()

# Load the data from the uploaded CSV file
data = pd.read_csv("./final.csv")

# Rename 'students' to 'Rice Owls'
data.rename(columns={"students": "Rice Owls"}, inplace=True)

# Line plot of average_time_ms by 'Rice Owls' for each model
plt.figure(figsize=(10, 6))
sns.lineplot(data=data, x='Rice Owls', y='average_time_ms', hue='model')
plt.title('Average Time (ms) by Number of Rice Owls')
plt.xlabel('Number of Rice Owls')
plt.ylabel('Average Time (ms)')
plt.savefig('last_lineplot.png')
plt.clf()

# Scatter plot of 'Rice Owls' vs. unique_birthday_days
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data, x='Rice Owls', y='unique_birthday_days', hue='model', style='model')
plt.title('Rice Owls vs. Unique Birthday Days')
plt.xlabel('Number of Rice Owls')
plt.ylabel('Unique Birthday Days')
plt.savefig('last_scatterplot.png')
plt.clf()

# Box plot of average_time_ms for each model
plt.figure(figsize=(10, 6))
sns.boxplot(data=data, x='model', y='average_time_ms')
plt.title('Box Plot of Average Time (ms) by Model')
plt.xlabel('Model')
plt.ylabel('Average Time (ms)')
plt.savefig('last_boxplot.png')
plt.clf()

# Scatter plot of 'Rice Owls' vs. average_time_ms
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data, x='Rice Owls', y='average_time_ms', hue='model', style='model')
plt.title('Rice Owls vs. Average Time (ms)')
plt.xlabel('Number of Rice Owls')
plt.ylabel('Average Time (ms)')
plt.savefig('last_scatterplot2.png')
plt.clf()

# Violin plot of average_time_ms for each model
plt.figure(figsize=(10, 6))
sns.violinplot(data=data, x='model', y='average_time_ms')
plt.title('Violin Plot of Average Time (ms) by Model')
plt.xlabel('Model')
plt.ylabel('Average Time (ms)')
plt.savefig('last_violinplot.png')
plt.clf()

# Adjust the plot to only show densities above a certain threshold
# Correcting the density sorting and plotting method

# Data preparation
x = data["Rice Owls"]
y = data["unique_birthday_days"]

# Calculate density using Gaussian filter on the histogram
data_points = np.vstack([x, y])
density = gaussian_filter(np.histogram2d(x, y, bins=100)[0], sigma=1)

# Convert histogram to coordinates
x_density, y_density = np.meshgrid(
    np.linspace(x.min(), x.max(), 100), np.linspace(y.min(), y.max(), 100)
)
density = density.ravel()
x_density = x_density.ravel()
y_density = y_density.ravel()

# Sorting points by density (for plotting purposes)
idx = np.argsort(density)
x_density, y_density, density = x_density[idx], y_density[idx], density[idx]

# Define a density threshold
density_threshold = 0.1

# Filter out points below the density threshold
mask = density > density_threshold
filtered_x_density = x_density[mask]
filtered_y_density = y_density[mask]
filtered_density = density[mask]

# Plotting with the density threshold
plt.figure(figsize=(14, 8))
sc = plt.scatter(
    filtered_x_density, filtered_y_density, c=filtered_density, cmap="viridis", s=50
)
plt.colorbar(sc, label="Density")
plt.xlabel("Number of Rice Owls")
plt.ylabel("Unique Birthday Days")
plt.title(
    "Filtered Density Scatter Plot of Unique Birthday Days vs. Number of Rice Owls"
)
plt.grid(True)
plt.savefig('last_density_scatterplot.png')


# Hexbin Plot with a Color Bar
plt.figure(figsize=(10, 6))

# Joint Plot with Regression Line
sns.jointplot(x='Rice Owls', y='unique_birthday_days', data=data, kind='reg', color='g', height=8)
plt.title('Joint Plot with Regression Line and Distributions')
plt.xlabel('Number of Rice Owls')
plt.ylabel('Unique Birthday Days')
plt.tight_layout()
plt.savefig('last_jointplot.png')

# Pair Plot
sns.pairplot(data[['Rice Owls', 'unique_birthday_days', 'average_time_ms']], height=3)
plt.suptitle('Pair Plot of Rice Owls, Unique Birthday Days, and Average Time (ms)')
plt.xlabel('Number of Rice Owls')
plt.ylabel('Unique Birthday Days')
plt.tight_layout()
plt.savefig('last_pairplot.png')
